import { ChatSession, ChatMessage } from "../db/models/chat.model";
import { protectedProcedure } from "../lib/orpc";
import { runRagWorkflow } from "../lib/n8nClient";
import z from "zod";
import { generateText, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { User } from "../db/models/auth.model";
import mongoose from "mongoose";

const generateSessionTitle = (firstMessage: string): string => {
  return firstMessage.length > 30
    ? firstMessage.substring(0, 27) + "..."
    : firstMessage;
};

export const chatRouter = {
  createSession: protectedProcedure
    .input(z.object({
      title: z.string().optional(),
      firstMessage: z.string().optional()
    }))
    .handler(async ({ input, context }) => {
      const { title, firstMessage } = input;
      const userId = context.session.user.id;

      let sessionTitle = title || "New Chat";

      // Use AI to generate session title if firstMessage is provided and no custom title
      if (firstMessage && !title) {
        try {
          const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            messages: [
              {
                role: 'system',
                content: 'Generate a short, descriptive title (max 30 characters) for a chat session based on the user\'s first message. Return only the title, nothing else.'
              },
              {
                role: 'user',
                content: firstMessage
              }
            ],
            temperature: 0.3,
          });
          sessionTitle = text.trim().substring(0, 30);
        } catch (error) {
          console.error("AI title generation error:", error);
          sessionTitle = generateSessionTitle(firstMessage);
        }
      }

      const session = new ChatSession({
        _id: new Date().getTime().toString(),
        title: sessionTitle,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await session.save();

      return { session };
    }),

  getSessions: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      includeArchived: z.boolean().default(false)
    }))
    .handler(async ({ input, context }) => {
      const { page, limit, includeArchived } = input;
      const userId = context.session.user.id;

      const filter: any = { userId };
      if (!includeArchived) {
        filter.isArchived = false;
      }

      const sessions = await ChatSession.find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await ChatSession.countDocuments(filter);

      return {
        sessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    }),

  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .handler(async ({ input, context }) => {
      const { sessionId } = input;
      const userId = context.session.user.id;

      const session = await ChatSession.findOne({
        _id: sessionId,
        userId
      }).lean();

      if (!session) {
        throw new Error("Session not found");
      }

      const messages = await ChatMessage.find({
        sessionId,
        isActive: true
      })
        .sort({ messageIndex: 1 })
        .lean();

      return { session, messages };
    }),

  sendMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string(),
      role: z.enum(['user', 'assistant', 'system']).default('user')
    }))
    .handler(async ({ input, context }) => {
      const { sessionId, content, role } = input;
      const userId = context.session.user.id;

      const session = await ChatSession.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error("Session not found");
      }

      const lastMessage = await ChatMessage.findOne({ sessionId })
        .sort({ messageIndex: -1 })
        .lean();

      const messageIndex = (lastMessage?.messageIndex ?? -1) + 1;

      const userMessage = new ChatMessage({
        _id: new Date().getTime().toString(),
        sessionId,
        messageIndex,
        role,
        content,
        variantIndex: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await userMessage.save();

      if (role === 'user') {
        const messages = await ChatMessage.find({
          sessionId,
          isActive: true
        })
          .sort({ messageIndex: 1 })
          .lean();

        const conversationHistory = messages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }));

        try {
          const startTime = Date.now();
          const user = await User.findOne({ email: context.session.user.email }).select("city").lean();

          const ragResponse = await runRagWorkflow({
            query: content,
            sessionId,
            city: user?.city || ""
          });
          const aiContent = ragResponse?.[0]?.output

          if (!aiContent || aiContent.trim().length === 0) {
            // Create error message instead of throwing
            const errorMessage = new ChatMessage({
              _id: (new Date().getTime() + 1).toString(),
              sessionId,
              messageIndex: messageIndex + 1,
              role: 'assistant',
              content: '❌ Unable to generate response. Please try regenerating this message.',
              variantIndex: 0,
              isActive: true,
              metadata: {
                model: 'error',
                isError: true,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            await errorMessage.save();
            
            session.updatedAt = new Date();
            await session.save();

            return { userMessage, aiMessage: errorMessage };
          }

          const responseTime = Date.now() - startTime;

          const aiMessage = new ChatMessage({
            _id: (new Date().getTime() + 1).toString(),
            sessionId,
            messageIndex: messageIndex + 1,
            role: 'assistant',
            content: aiContent,
            variantIndex: 0,
            isActive: true,
            metadata: {
              model: 'n8n-rag-workflow',
              responseTime,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await aiMessage.save();

          session.updatedAt = new Date();
          await session.save();

          return { userMessage, aiMessage };
        } catch (error) {
          console.error("RAG workflow error:", (error as any)?.response?.data?.message || (error as any)?.data?.message);
          
          // Create error message instead of throwing
          const errorMessage = new ChatMessage({
            _id: (new Date().getTime() + 1).toString(),
            sessionId,
            messageIndex: messageIndex + 1,
            role: 'assistant',
            content: '❌ Server error: Unable to generate response. This might be due to high traffic or connectivity issues. Please try regenerating this message.',
            variantIndex: 0,
            isActive: true,
            metadata: {
              model: 'error',
              isError: true,
              errorDetails: (error as any)?.message || 'Unknown error'
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await errorMessage.save();
          
          session.updatedAt = new Date();
          await session.save();

          return { userMessage, aiMessage: errorMessage };
        }
      }

      session.updatedAt = new Date();
      await session.save();

      return { userMessage };
    }),

  regenerateMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      messageId: z.string()
    }))
    .handler(async ({ input, context }) => {
      const { sessionId, messageId } = input;
      const userId = context.session.user.id;

      const session = await ChatSession.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error("Session not found");
      }

      const targetMessage = await ChatMessage.findOne({
        _id: messageId,
        sessionId
      });

      if (!targetMessage || targetMessage.role !== 'assistant') {
        throw new Error("Invalid message for regeneration");
      }

      await ChatMessage.updateMany(
        {
          sessionId,
          messageIndex: targetMessage.messageIndex,
          role: 'assistant'
        },
        { isActive: false }
      );

      const maxVariant = await ChatMessage.findOne({
        sessionId,
        messageIndex: targetMessage.messageIndex,
        role: 'assistant'
      }).sort({ variantIndex: -1 });

      const newVariantIndex = (maxVariant?.variantIndex ?? -1) + 1;

      const messages = await ChatMessage.find({
        sessionId,
        isActive: true,
        messageIndex: { $lt: targetMessage.messageIndex }
      })
        .sort({ messageIndex: 1 })
        .lean();

      const conversationHistory = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));

      try {
        const startTime = Date.now();

        const user = await User.findOne({ email: context.session.user.email }).select("city").lean();

        // Get the original user query for RAG
        const userQuery = conversationHistory[conversationHistory.length - 1]?.content || '';

        const ragResponse = await runRagWorkflow({
          query: userQuery,
          sessionId,
          city: user?.city || ""
        });
        const aiContent = ragResponse?.[0]?.output;

        if (!aiContent || aiContent.trim().length === 0) {
          // Create error message instead of throwing
          const errorMessage = new ChatMessage({
            _id: new Date().getTime().toString(),
            sessionId,
            messageIndex: targetMessage.messageIndex,
            role: 'assistant',
            content: '❌ Unable to regenerate response. Please try again.',
            variantIndex: newVariantIndex,
            isActive: true,
            metadata: {
              model: 'error',
              isError: true,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await errorMessage.save();
          session.updatedAt = new Date();
          await session.save();
          return errorMessage;
        }

        const responseTime = Date.now() - startTime;

        const newMessage = new ChatMessage({
          _id: new Date().getTime().toString(),
          sessionId,
          messageIndex: targetMessage.messageIndex,
          role: 'assistant',
          content: aiContent,
          variantIndex: newVariantIndex,
          isActive: true,
          metadata: {
            model: 'n8n-rag-workflow',
            responseTime,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await newMessage.save();

        session.updatedAt = new Date();
        await session.save();

        return newMessage;
      } catch (error) {console.error("RAG workflow error:", (error as any)?.response?.data?.message || (error as any)?.data?.message);
        
        // Create error message instead of throwing
        const errorMessage = new ChatMessage({
          _id: new Date().getTime().toString(),
          sessionId,
          messageIndex: targetMessage.messageIndex,
          role: 'assistant',
          content: '❌ Server error: Unable to regenerate response. This might be due to high traffic or connectivity issues. Please try again.',
          variantIndex: newVariantIndex,
          isActive: true,
          metadata: {
            model: 'error',
            isError: true,
            errorDetails: (error as any)?.message || 'Unknown error'
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await errorMessage.save();
        session.updatedAt = new Date();
        await session.save();
        return errorMessage;
      }
    }),

  switchMessageVariant: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      messageIndex: z.number(),
      variantIndex: z.number()
    }))
    .handler(async ({ input, context }) => {
      const { sessionId, messageIndex, variantIndex } = input;
      const userId = context.session.user.id;

      const session = await ChatSession.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error("Session not found");
      }

      await ChatMessage.updateMany(
        { sessionId, messageIndex },
        { isActive: false }
      );

      const targetMessage = await ChatMessage.findOneAndUpdate(
        { sessionId, messageIndex, variantIndex },
        { isActive: true },
        { new: true }
      );

      if (!targetMessage) {
        throw new Error("Message variant not found");
      }

      return targetMessage;
    }),

  deleteSession: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      permanent: z.boolean().default(false)
    }))
    .handler(async ({ input, context }) => {
      const { sessionId, permanent } = input;
      const userId = context.session.user.id;

      if (permanent) {
        await ChatMessage.deleteMany({ sessionId });
        await ChatSession.deleteOne({ _id: sessionId, userId });
      } else {
        await ChatSession.updateOne(
          { _id: sessionId, userId },
          { isArchived: true, updatedAt: new Date() }
        );
      }

      return { success: true };
    }),

  updateSession: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      title: z.string().optional(),
      isArchived: z.boolean().optional()
    }))
    .handler(async ({ input, context }) => {
      const { sessionId, title, isArchived } = input;
      const userId = context.session.user.id;

      const updateData: any = { updatedAt: new Date() };
      if (title !== undefined) updateData.title = title;
      if (isArchived !== undefined) updateData.isArchived = isArchived;

      const session = await ChatSession.findOneAndUpdate(
        { _id: sessionId, userId },
        updateData,
        { new: true }
      );

      if (!session) {
        throw new Error("Session not found");
      }

      return session;
    }),

  getMessageVariants: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      messageIndex: z.number()
    }))
    .handler(async ({ input, context }) => {
      const { sessionId, messageIndex } = input;
      const userId = context.session.user.id;

      const session = await ChatSession.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error("Session not found");
      }

      const variants = await ChatMessage.find({
        sessionId,
        messageIndex,
        role: 'assistant'
      })
        .sort({ variantIndex: 1 })
        .lean();

      return variants;
    }),

  streamMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string(),
      useRAG: z.boolean().default(true)
    }))
    .handler(async ({ input, context }) => {
      const { sessionId, content, useRAG } = input;
      const userId = context.session.user.id;

      const session = await ChatSession.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error("Session not found");
      }

      // Save user message first
      const lastMessage = await ChatMessage.findOne({ sessionId })
        .sort({ messageIndex: -1 })
        .lean();

      const messageIndex = (lastMessage?.messageIndex ?? -1) + 1;

      const userMessage = new ChatMessage({
        _id: new Date().getTime().toString(),
        sessionId,
        messageIndex,
        role: 'user',
        content,
        variantIndex: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await userMessage.save();

      // Get conversation history for streaming
      const messages = await ChatMessage.find({
        sessionId,
        isActive: true
      })
        .sort({ messageIndex: 1 })
        .lean();

      const conversationHistory = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));

      try {
        if (useRAG) {
          
          const user = await User.findOne({ email: context.session.user.email }).select("city").lean();

          // For RAG, we return the response directly (not streaming)
          const ragResponse = await runRagWorkflow({
            query: content,
            sessionId,
            city: user?.city || ""
          });
          const aiContent = ragResponse?.[0]?.output;

          if (!aiContent || aiContent.trim().length === 0) {
            // Create error message instead of throwing
            const errorMessage = new ChatMessage({
              _id: (new Date().getTime() + 1).toString(),
              sessionId,
              messageIndex: messageIndex + 1,
              role: 'assistant',
              content: '❌ Unable to generate response. Please try regenerating this message.',
              variantIndex: 0,
              isActive: true,
              metadata: {
                model: 'error',
                isError: true,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            await errorMessage.save();

            session.updatedAt = new Date();
            await session.save();

            return { userMessage, aiMessage: errorMessage, streaming: false };
          }

          const aiMessage = new ChatMessage({
            _id: (new Date().getTime() + 1).toString(),
            sessionId,
            messageIndex: messageIndex + 1,
            role: 'assistant',
            content: aiContent,
            variantIndex: 0,
            isActive: true,
            metadata: {
              model: 'n8n-rag-workflow',
              responseTime: 0,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await aiMessage.save();

          session.updatedAt = new Date();
          await session.save();

          return { userMessage, aiMessage, streaming: false };
        } else {
          // For streaming, return stream configuration
          const streamConfig = {
            model: google("gemini-2.0-flash-lite"),
            system: "You are an agricultural assistant. Provide helpful farming and agricultural advice.",
            messages: conversationHistory,
          };

          return {
            userMessage,
            streamConfig,
            streaming: true,
            sessionId,
            messageIndex: messageIndex + 1
          };
        }
      } catch (error) {
        console.error("RAG workflow error:", (error as any)?.response?.data?.message || (error as any)?.data?.message);
        
        // Create error message instead of throwing
        const errorMessage = new ChatMessage({
          _id: (new Date().getTime() + 1).toString(),
          sessionId,
          messageIndex: messageIndex + 1,
          role: 'assistant',
          content: '❌ Server error: Failed to process message. Please try regenerating this message.',
          variantIndex: 0,
          isActive: true,
          metadata: {
            model: 'error',
            isError: true,
            errorDetails: (error as any)?.message || 'Unknown error'
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await errorMessage.save();
        
        session.updatedAt = new Date();
        await session.save();

        return { userMessage, aiMessage: errorMessage, streaming: false };
      }
    }),
};

export type ChatRouter = typeof chatRouter;
