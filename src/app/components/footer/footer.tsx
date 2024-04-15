import MaxWidthWrapper from "@/components/maxWidthWrapper";

const Footer = () => {
  return (
    <MaxWidthWrapper>
      <footer style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <div className="m-2 flex">
          <div>
            <p>© 2024 Albert Shih</p>
          </div>
        </div>
      </footer>
    </MaxWidthWrapper>
  );
};

export default Footer;
