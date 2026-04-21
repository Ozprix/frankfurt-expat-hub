import { toast } from '@/components/ui/use-toast';

export const handlePaymentError = (error, context = 'checkout') => {
  console.error(`Payment/Data Error (${context}):`, error);

  let title = "Action Failed";
  let description = "An unexpected error occurred. Please try again.";

  // Handle Supabase RLS Policy Errors (42501)
  if (error?.code === '42501' || error?.message?.includes('row-level security')) {
    title = "Permission Denied";
    description = "You do not have permission to perform this action. Please contact support if this persists.";
  } 
  // Handle Email Not Confirmed
  else if (error?.message?.includes('Email not confirmed') || error?.code === 'email_not_confirmed') {
    title = "Email Not Verified";
    description = "Please check your inbox and verify your email address before continuing.";
  }
  // Handle Rate Limits
  else if (error?.message?.includes('rate limit') || error?.code === 'over_email_send_rate_limit') {
    title = "Too Many Requests";
    description = "You have exceeded the email rate limit. Please wait a few minutes before trying again.";
  }
  else if (error?.message?.includes('network')) {
    description = "Network error. Please check your internet connection.";
  } else if (error?.message?.includes('validation')) {
    title = "Invalid Request";
    description = "Please check your details and try again.";
  } else if (error?.message?.includes('declined')) {
    description = "Card was declined. Please try a different payment method.";
  } else if (error?.message?.includes('Missing store ID')) {
    description = "System configuration error. Please contact support.";
  } else if (error?.message?.includes('Invalid login credentials')) {
    title = "Login Failed";
    description = "Invalid email or password. Please try again.";
  }

  toast({
    title,
    description,
    variant: "destructive",
  });

  return { error: true, message: description, code: error?.code };
};