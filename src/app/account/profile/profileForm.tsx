import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail } from "lucide-react";

export interface UserDetails {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

const ProfileForm = ({ userDetails }: { userDetails: UserDetails }) => {
  let verifyAlert = null;
  if (!userDetails.emailVerified) {
    verifyAlert = (
      <Alert variant="destructive">
        <Mail className="h-5 w-5" />
        <AlertTitle>Email Not Verified</AlertTitle>
        <AlertDescription>
          Your email address has not been verified. Please check your inbox for
          a verification email.
        </AlertDescription>
      </Alert>
    );
  }

  return <div>{verifyAlert}</div>;
};

export default ProfileForm;
