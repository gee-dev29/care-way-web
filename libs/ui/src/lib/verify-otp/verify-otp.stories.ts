import type { Meta, StoryObj } from '@storybook/angular';
import { VerifyOtp } from './verify-otp';
import { expect } from 'storybook/test';

const meta: Meta<VerifyOtp> = {
  component: VerifyOtp,
  title: 'VerifyOtp',
};
export default meta;

type Story = StoryObj<VerifyOtp>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/verify-otp/gi)).toBeTruthy();
  },
};
