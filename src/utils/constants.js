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

export const CLUBS_STATUS = {
  ACTIVE: "active",
  DISABLED: "disabled",
};

export const TEAMS_INVIATION_TYPES = {
  PAID: "Paid",
  FREE: "Free",
  VERIFICATION: "Verification Free",
};

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const SEASONS = [
  "2024/25",
  "2024",
  "2023/24",
  "2023",
  "2022/23",
  "2022",
  "2021/22",
  "2021",
  "2020/21",
  "2020",
  "2019/20",
  "2019",
  "2018/19",
  "2018",
  "2017/18",
  "2017",
  "2016/17",
  "2016",
  "2015/16",
  "2015",
  "2014/15",
  "2014",
  "2013/14",
  "2013",
  "2012/13",
  "2012",
  "2011/12",
  "2011",
  "2010/11",
  "2010",
  "2009/10",
  "2009",
  "2008/09",
  "2008",
  "2007/08",
  "2007",
  "2006/07",
  "2006",
  "2005/06",
  "2005",
  "2004/05",
  "2004",
  "2003/04",
  "2003",
  "2002/03",
  "2002",
  "2001/02",
  "2001",
  "2000/01",
  "2000",
];
