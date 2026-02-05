/**
 * Editorial Modernism Theme für Clerk
 * 
 * Design-System:
 * - Bronze-Akzent (#9A6F4F light / #D4A574 dark)
 * - Serif-Headlines (Crimson Pro)
 * - Sans-Serif Body (DM Sans)
 * - Brutalist Sharp Shadows
 * - Rounded corners: 6px
 * - Uppercase tracking für Labels
 */

export const clerkAppearance = {
  variables: {
    // Farben - nutzen CSS-Variablen für Dark Mode Support
    colorPrimary: "#9A6F4F",
    colorText: "#1A1A1A",
    colorTextSecondary: "#666461",
    colorBackground: "#FFFFFF",
    colorInputBackground: "transparent",
    colorInputText: "#1A1A1A",
    colorDanger: "#B23A2F",
    
    // Typografie
    fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
    fontFamilyButtons: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
    
    // Borders & Radius
    borderRadius: "6px",
  },
  
  elements: {
    // ==========================================
    // ALLGEMEINE CARD & CONTAINER
    // ==========================================
    rootBox: "font-sans",
    card: "bg-card border border-border shadow-none rounded-[6px]",
    
    // ==========================================
    // HEADER
    // ==========================================
    headerTitle: "font-serif text-2xl font-bold text-foreground",
    headerSubtitle: "text-muted-foreground text-sm",
    
    // ==========================================
    // SOCIAL BUTTONS (Google, GitHub etc.)
    // ==========================================
    socialButtonsBlockButton: 
      "bg-secondary border border-border text-foreground hover:bg-secondary/80 rounded-[6px] transition-all duration-200 shadow-none",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    socialButtonsBlockButtonArrow: "text-muted-foreground",
    socialButtonsProviderIcon: "w-5 h-5",
    
    // ==========================================
    // DIVIDER
    // ==========================================
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground text-xs uppercase tracking-widest",
    
    // ==========================================
    // FORM FIELDS
    // ==========================================
    formFieldLabel: "text-foreground text-xs font-medium uppercase tracking-wide mb-2",
    formFieldInput: 
      "bg-transparent border-0 border-b-2 border-border text-foreground rounded-none px-0 py-2 " +
      "placeholder:text-muted-foreground/50 " +
      "focus:border-accent focus:ring-0 focus:outline-none " +
      "transition-colors duration-200",
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
    formFieldErrorText: "text-destructive text-xs mt-1",
    formFieldSuccessText: "text-green-600 text-xs mt-1",
    formFieldHintText: "text-muted-foreground text-xs mt-1",
    
    // ==========================================
    // BUTTONS
    // ==========================================
    formButtonPrimary: 
      "bg-accent hover:bg-accent/90 text-accent-foreground " +
      "rounded-[6px] uppercase tracking-wide font-medium text-sm " +
      "shadow-editorial-sm hover:shadow-editorial-md " +
      "transition-all duration-200 py-3",
    formButtonReset: "text-accent hover:text-accent/80 text-sm",
    
    // ==========================================
    // FOOTER / LINKS
    // ==========================================
    footerAction: "mt-6",
    footerActionText: "text-muted-foreground text-sm",
    footerActionLink: "text-accent hover:text-accent/80 font-medium transition-colors",
    
    // ==========================================
    // ALTERNATIVE METHODS
    // ==========================================
    alternativeMethodsBlockButton: 
      "bg-secondary border border-border text-foreground hover:bg-secondary/80 rounded-[6px] text-sm",
    
    // ==========================================
    // AVATAR
    // ==========================================
    avatarBox: "w-9 h-9 rounded-full border-2 border-border",
    avatarImage: "rounded-full",
    
    // ==========================================
    // USER BUTTON (Dropdown in Navigation)
    // ==========================================
    userButtonBox: "focus:ring-2 focus:ring-accent/30 rounded-full",
    userButtonTrigger: "focus:shadow-none",
    userButtonPopoverCard: 
      "bg-card border border-border rounded-[6px] shadow-editorial-lg overflow-hidden",
    userButtonPopoverMain: "p-0",
    userButtonPopoverActions: "border-t border-border",
    userButtonPopoverActionButton: 
      "text-foreground hover:bg-secondary/80 rounded-none px-4 py-3 text-sm " +
      "transition-colors duration-200",
    userButtonPopoverActionButtonIcon: "text-muted-foreground w-4 h-4",
    userButtonPopoverActionButtonText: "text-foreground",
    userButtonPopoverFooter: "hidden", // Clerk branding ausblenden
    
    // ==========================================
    // USER PROFILE (Modal/Page)
    // ==========================================
    userProfilePage: "p-0",
    userProfileCard: "bg-card border-0 shadow-none",
    
    // Profile Header
    profileSectionTitle: "font-serif text-lg font-bold text-foreground",
    profileSectionTitleText: "font-serif text-lg font-bold text-foreground",
    profileSectionSubtitle: "text-muted-foreground text-sm",
    profileSectionContent: "border-t border-border pt-4",
    
    // Profile Page Buttons
    profileSectionPrimaryButton: 
      "bg-accent hover:bg-accent/90 text-accent-foreground rounded-[6px] text-sm font-medium",
    
    // Navbar in User Profile
    navbar: "border-r border-border bg-secondary/30",
    navbarButton: "text-foreground hover:bg-secondary rounded-[6px] text-sm",
    navbarButtonIcon: "text-muted-foreground",
    navbarMobileMenuButton: "text-foreground",
    navbarMobileMenuRow: "border-b border-border",
    
    // Page/Scrollbox
    pageScrollBox: "p-6",
    page: "gap-6",
    
    // Form in Profile
    formFieldRow: "gap-4",
    formFieldAction: "text-accent hover:text-accent/80 text-sm",
    
    // Badges
    badge: "bg-accent/10 text-accent rounded-full text-xs px-2 py-0.5 font-medium",
    badgePrimary: "bg-accent text-accent-foreground",
    
    // ==========================================
    // VERIFICATION & OTP
    // ==========================================
    otpCodeFieldInput: 
      "border-2 border-border rounded-[6px] text-foreground text-center text-lg font-mono " +
      "focus:border-accent focus:ring-0",
    
    // ==========================================
    // IDENTITY PREVIEW (Email/Phone shown)
    // ==========================================
    identityPreview: "bg-secondary/50 rounded-[6px] p-3 border border-border",
    identityPreviewText: "text-foreground font-medium",
    identityPreviewEditButton: "text-accent hover:text-accent/80 text-sm",
    
    // ==========================================
    // ALERTS
    // ==========================================
    alert: "bg-secondary/50 border border-border rounded-[6px] text-foreground",
    alertText: "text-foreground text-sm",
    
    // ==========================================
    // MODAL BACKDROP
    // ==========================================
    modalBackdrop: "bg-background/80 backdrop-blur-sm",
    modalContent: "bg-card border border-border rounded-[6px] shadow-editorial-lg",
    
    // ==========================================
    // MENU ITEMS (in Dropdowns)
    // ==========================================
    menuButton: "text-foreground hover:bg-secondary rounded-[6px] text-sm",
    menuItem: "text-foreground hover:bg-secondary px-3 py-2 text-sm",
    menuList: "bg-card border border-border rounded-[6px] shadow-editorial-md p-1",
    
    // ==========================================
    // SELECT / DROPDOWN
    // ==========================================
    selectButton: "bg-transparent border border-border rounded-[6px] text-foreground",
    selectOptionsContainer: "bg-card border border-border rounded-[6px] shadow-editorial-md",
    selectOption: "text-foreground hover:bg-secondary px-3 py-2 text-sm",
  },
};

/**
 * Dark Mode Overrides
 * Diese werden automatisch angewendet wenn .dark Klasse auf html ist
 */
export const clerkDarkModeStyles = `
  .dark .cl-card {
    --clerk-color-primary: #D4A574;
    --clerk-color-text: #EFEDE8;
    --clerk-color-text-secondary: #A8A6A0;
    --clerk-color-background: #1A1A1A;
    --clerk-color-danger: #E85D4F;
  }
`;
