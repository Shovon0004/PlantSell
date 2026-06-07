"use client";

interface Tab {
  key: string;
  label: string;
}

const TABS: Tab[] = [
  { key: "all", label: "🌿 All Products" },
  { key: "trees", label: "🌳 Trees & Plants" },
  { key: "fertilizers", label: "🧪 Fertilizers" },
];

interface ShopPageHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabMeta: Record<string, { title: string; subtitle: string; crumb: string }> = {
  all: {
    title: 'Our <em>Shop</em>',
    subtitle: "Explore premium plants, trees & fertilizers — delivered fresh to your door.",
    crumb: "Shop",
  },
  trees: {
    title: 'Trees & <em>Plants</em>',
    subtitle: "From bonsai to fruit trees — nature's finest selection.",
    crumb: "Trees & Plants",
  },
  fertilizers: {
    title: 'Our <em>Fertilizers</em>',
    subtitle: "Organic blends, NPK mixes & liquid boosters for thriving growth.",
    crumb: "Fertilizers",
  },
};

export default function ShopPageHeader({ activeTab, onTabChange }: ShopPageHeaderProps) {
  const meta = tabMeta[activeTab] || tabMeta.all;

  return (
    <div className="shop-page-header">
      <div className="shop-page-header__inner">
        <div className="shop-breadcrumb">
          <a href="/">Home</a> › <span>{meta.crumb}</span>
        </div>
        <h1
          className="shop-page-title"
          dangerouslySetInnerHTML={{ __html: meta.title }}
        />
        <p className="shop-page-subtitle">{meta.subtitle}</p>
      </div>
      <div className="shop-main-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`shop-main-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
