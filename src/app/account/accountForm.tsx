"use client";

import { UserProfile } from "@clerk/nextjs";

const AccountForm = () => {
  return (
    <div className="flex justify-center">
      <UserProfile
        routing="virtual"
        appearance={{
          elements: {
            card: "shadow-none border border-border",
          },
        }}
      />
    </div>
  );
};

export default AccountForm;
