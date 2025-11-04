import dynamic from "next/dynamic";
import MaxWidthWrapper from "@/components/maxWidthWrapper";

const AccountClientPage = dynamic(() => import("./accountClientPage"), {
  ssr: false,
  loading: () => (
    <MaxWidthWrapper>
      <div className="py-16 text-center text-muted-foreground">
        Loading account settings...
      </div>
    </MaxWidthWrapper>
  ),
});

const AccountPage = () => {
  return <AccountClientPage />;
};

export default AccountPage;
