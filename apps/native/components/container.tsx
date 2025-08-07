import { cn } from "@/lib/utils";
import React from "react";
import { SafeAreaView, ViewProps } from "react-native";

export const Container = ({ children, ...props }: ViewProps) => {
  return (
    <SafeAreaView {...props} className={cn("flex-1 bg-background", props?.className)} >
      {children}
    </SafeAreaView>
  );
};
