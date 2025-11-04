export const authAppearance = {
  layout: {
    shimmer: false,
    logoPlacement: "none" as const,
    logoImageUrl: "",
  },
  variables: {
    colorBackground: "hsl(var(--card))",
    colorPrimary: "hsl(var(--primary))",
    colorText: "hsl(var(--foreground))",
    borderRadius: "18px",
    fontFamily: "var(--font-sans)",
    colorAlphaShade: "0 0 0 / 0.04",
  },
  elements: {
  card: "shadow-xl border border-border/70 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-sm transition-opacity duration-200 ease-out",
    headerTitle: "text-xl font-semibold",
    headerSubtitle: "text-sm text-muted-foreground",
    footer: "hidden",
    developmentBadge: "hidden",
    formButtonPrimary: "bg-primary text-primary-foreground transition-colors duration-150 ease-out hover:bg-primary/90",
    formFieldInput: "rounded-lg border-border/70 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    socialButtonsBlockButton: "rounded-lg border border-border/60 transition-colors duration-150 ease-out hover:bg-muted/70",
    rootBox: "auth-animate",
  },
} as const;
