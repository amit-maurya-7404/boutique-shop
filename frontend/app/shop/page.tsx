import dynamic from 'next/dynamic';

const ShopClient = dynamic(() => import('./ShopClient'), { ssr: false });

export default function Page() {
  return <ShopClient />;
}
