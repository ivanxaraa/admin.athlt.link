export const app = {
  website_url: "https://athlt.link",
  storage_url:
    "https://vkgipqsozevltuwoxkfe.supabase.co/storage/v1/object/public",
};

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  // website
  PUBLIC_APP_LINK: process.env.PUBLIC_APP_LINK,
  PUBLIC_APP_IMAGE: process.env.PUBLIC_APP_IMAGE,
  // storage
  PUBLIC_STORAGE_URL: process.env.PUBLIC_STORAGE_URL,
};

export const icon_size = {
  navbar: {
    size: 18,
    strokeWidth: 1,
  },
  buttons: {},
};
