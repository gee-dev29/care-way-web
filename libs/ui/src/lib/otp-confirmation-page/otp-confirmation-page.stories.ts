import type { Meta, StoryObj } from '@storybook/angular';
import { OtpConfirmationPage } from './otp-confirmation-page';
import { expect } from 'storybook/test';

const meta: Meta<OtpConfirmationPage> = {
  component: OtpConfirmationPage,
  title: 'OtpConfirmationPage',
};
export default meta;

type Story = StoryObj<OtpConfirmationPage>;

export const Primary: Story = {
  args: {
    open: false,
  },
};

export const Heading: Story = {
  args: {
    open: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/otp-confirmation-page/gi)).toBeTruthy();
  },
};
