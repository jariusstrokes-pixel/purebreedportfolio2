import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { mainnet, base } from 'wagmi/chains';

const projectId = 'b4120ab9f3e8991c519b01a5d16eeb06'; // Get from cloud.walletconnect.com

const metadata = {
  name: 'PureBreeds',
  description: 'an app where you see live data of endangered animals',
  url: window.location.origin,
  icons: ['https://your-icon-url.com/icon.png'],
};

const chains = [mainnet, base] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
});
