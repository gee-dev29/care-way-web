import type { Meta, StoryObj } from '@storybook/angular';
import { ForgotPassword } from './forgot-password';
import { expect } from 'storybook/test';

const meta: Meta<ForgotPassword> = {
  component: ForgotPassword,
  title: 'ForgotPassword',
};
export default meta;

type Story = StoryObj<ForgotPassword>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/forgot-password/gi)).toBeTruthy();
  },
};
