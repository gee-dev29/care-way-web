import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input';
import { expect } from 'storybook/test';

const meta: Meta<InputComponent> = {
  component: InputComponent,
  title: 'InputComponent',
};
export default meta;

type Story = StoryObj<InputComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/input/gi)).toBeTruthy();
  },
};
