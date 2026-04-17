"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";

export const approveAccount = async (userId: string, userEmail: string, userName: string) => {
  try {
    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId));

    // Send approval email
    await sendEmail({
      email: userEmail,
      subject: "Account Approved - BookWise",
      message: `Dear ${userName},<br/><br/>Your account has been approved! You can now borrow books from the library.<br/><br/>Best regards,<br/>BookWise Team`,
    });

    return {
      success: true,
      message: "Account approved successfully",
    };
  } catch (error) {
    console.error("Error approving account:", error);
    return {
      success: false,
      message: "Failed to approve account",
    };
  }
};

export const denyAccount = async (userId: string, userEmail: string, userName: string) => {
  try {
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    // Send denial email
    await sendEmail({
      email: userEmail,
      subject: "Account Request Update - BookWise",
      message: `Dear ${userName},<br/><br/>We regret to inform you that your account request has been denied due to unsuccessful ID card verification. Please contact support for more information.<br/><br/>Best regards,<br/>BookWise Team`,
    });

    return {
      success: true,
      message: "Account denied successfully",
    };
  } catch (error) {
    console.error("Error denying account:", error);
    return {
      success: false,
      message: "Failed to deny account",
    };
  }
};