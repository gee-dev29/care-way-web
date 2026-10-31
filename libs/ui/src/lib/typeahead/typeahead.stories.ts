import type { Meta, StoryObj } from '@storybook/angular';
import { Typeahead } from './typeahead';
import { expect } from 'storybook/test';

const meta: Meta<Typeahead> = {
  component: Typeahead,
  title: 'Typeahead',
};
export default meta;

type Story = StoryObj<Typeahead>;

export const Primary: Story = {
  args: {
    items: [],
    title: '',
    label: '',
    isMultiselect: false,
  },
};

export const Heading: Story = {
  args: {
    items: [],
    title: '',
    label: '',
    isMultiselect: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/typeahead/gi)).toBeTruthy();
  },
};
