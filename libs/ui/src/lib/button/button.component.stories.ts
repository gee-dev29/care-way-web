import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { expect } from 'storybook/test';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'ButtonComponent',
};
export default meta;

type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    backgroundColor: "",
    size: "full",
    width: "full",
    icon: '',
    label: "",
    fill: "",
    shape: "",
    slot: '',
    image: "",
    showImage: false,
    showIcon: false,
    loading: false,
    disabled: false,
    style: '',
  },
};

export const Heading: Story = {
  args: {
    backgroundColor: '',
    size: 'medium',
    width: 'fit',
    icon: '',
    label: '',
    fill: '',
    shape: '',
    slot: '',
    image: '',
    showImage: false,
    showIcon: false,
    loading: false,
    disabled: false,
    style: '',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/button/gi)).toBeTruthy();
  },
};
