import type { Meta, StoryObj } from '@storybook/angular';
import { MoreMenuPage } from './more-menu-page';
import { expect } from 'storybook/test';

const meta: Meta<MoreMenuPage> = {
  component: MoreMenuPage,
  title: 'MoreMenuPage',
};
export default meta;

type Story = StoryObj<MoreMenuPage>;

export const Primary: Story = {
  args: {
    otherMenus: [],
  },
};

export const Heading: Story = {
  args: {
    otherMenus: [],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/more-menu-page/gi)).toBeTruthy();
  },
};
