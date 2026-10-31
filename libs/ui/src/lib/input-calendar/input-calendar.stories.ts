import type { Meta, StoryObj } from '@storybook/angular';
import { InputCalendar } from './input-calendar';
import { expect } from 'storybook/test';

const meta: Meta<InputCalendar> = {
  component: InputCalendar,
  title: 'InputCalendar',
};
export default meta;

type Story = StoryObj<InputCalendar>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/input-calendar/gi)).toBeTruthy();
  },
};
