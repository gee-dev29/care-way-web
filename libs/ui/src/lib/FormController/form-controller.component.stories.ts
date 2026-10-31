import { Meta } from '@storybook/angular';
import { FormControllerComponent } from './form-controller.component';

export default {
  title: 'FormControllerComponent',
  component: FormControllerComponent,
} as Meta<FormControllerComponent>;

export const Primary = {
  render: (args: FormControllerComponent) => ({
    props: args,
  }),
  args: {
    type: 'text',
    label: 'Name',
    filter: false,
  },
};
