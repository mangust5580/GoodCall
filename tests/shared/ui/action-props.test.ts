import { describe, it, expect } from 'vitest';
import type { ButtonHTMLAttributes } from 'react';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';
import type { ButtonProps, IconButtonProps, LinkProps } from '@/shared/ui';

type Assert<T extends true> = T;

type Absent<TProps, TKeys> = [Extract<keyof TProps, TKeys>] extends [never] ? true : false;

type Present<TProps, TKeys extends PropertyKey> = TKeys extends keyof TProps ? true : false;

type IsRequired<TProps, TKey extends keyof TProps> =
  Record<never, never> extends Pick<TProps, TKey> ? false : true;

type ControlForbiddenProp =
  'style' | 'role' | 'tabIndex' | 'aria-disabled' | 'aria-label' | 'aria-labelledby' | 'aria-busy';

type LinkForbiddenProp =
  | 'style'
  | 'role'
  | 'tabIndex'
  | 'aria-disabled'
  | 'aria-label'
  | 'aria-labelledby'
  | 'href'
  | 'disabled'
  | 'isLoading';

type NavigationEscapeProp = 'as' | 'href' | 'to';

type ButtonForbiddenPropsAbsent = Assert<
  Absent<ButtonProps, ControlForbiddenProp | NavigationEscapeProp>
>;

type ButtonPropsPreserved = Assert<
  Present<ButtonProps, 'id' | 'className' | 'disabled' | 'type' | 'onClick' | 'aria-describedby'>
>;

type ButtonChildrenRequired = Assert<IsRequired<ButtonProps, 'children'>>;

type LinkForbiddenPropsAbsent = Assert<Absent<LinkProps, LinkForbiddenProp | 'as'>>;

type LinkPropsPreserved = Assert<
  Present<LinkProps, 'id' | 'className' | 'to' | 'aria-describedby'>
>;

type LinkToRequired = Assert<IsRequired<LinkProps, 'to'>>;

type LinkChildrenRequired = Assert<IsRequired<LinkProps, 'children'>>;

type IconButtonForbiddenPropsAbsent = Assert<
  Absent<IconButtonProps, ControlForbiddenProp | NavigationEscapeProp>
>;

type IconButtonPropsPreserved = Assert<
  Present<
    IconButtonProps,
    'id' | 'className' | 'disabled' | 'type' | 'onClick' | 'aria-describedby'
  >
>;

type IconButtonLabelRequired = Assert<IsRequired<IconButtonProps, 'label'>>;

type IconButtonChildrenRequired = Assert<IsRequired<IconButtonProps, 'children'>>;

type ControlForbiddenPropsExistOnButtonBase = Assert<
  Present<ButtonHTMLAttributes<HTMLButtonElement>, ControlForbiddenProp>
>;

type LinkForbiddenPropsExistOnRouterBase = Assert<
  Present<
    RouterLinkProps,
    'style' | 'role' | 'tabIndex' | 'aria-disabled' | 'aria-label' | 'aria-labelledby'
  >
>;

describe('Action primitive type contracts', () => {
  it('removes semantic-override and busy-state props from Button', () => {
    const buttonForbiddenPropsAbsent: ButtonForbiddenPropsAbsent = true;

    expect(buttonForbiddenPropsAbsent).toBe(true);
  });

  it('keeps Button consumer props and requires a visible label', () => {
    const buttonPropsPreserved: ButtonPropsPreserved = true;
    const buttonChildrenRequired: ButtonChildrenRequired = true;

    expect(buttonPropsPreserved).toBe(true);
    expect(buttonChildrenRequired).toBe(true);
  });

  it('removes disabled, loading, tab-order and semantic-override props from Link', () => {
    const linkForbiddenPropsAbsent: LinkForbiddenPropsAbsent = true;

    expect(linkForbiddenPropsAbsent).toBe(true);
  });

  it('keeps Link consumer props and requires to and children', () => {
    const linkPropsPreserved: LinkPropsPreserved = true;
    const linkToRequired: LinkToRequired = true;
    const linkChildrenRequired: LinkChildrenRequired = true;

    expect(linkPropsPreserved).toBe(true);
    expect(linkToRequired).toBe(true);
    expect(linkChildrenRequired).toBe(true);
  });

  it('removes semantic-override and busy-state props from IconButton', () => {
    const iconButtonForbiddenPropsAbsent: IconButtonForbiddenPropsAbsent = true;

    expect(iconButtonForbiddenPropsAbsent).toBe(true);
  });

  it('keeps IconButton consumer props and requires label and children', () => {
    const iconButtonPropsPreserved: IconButtonPropsPreserved = true;
    const iconButtonLabelRequired: IconButtonLabelRequired = true;
    const iconButtonChildrenRequired: IconButtonChildrenRequired = true;

    expect(iconButtonPropsPreserved).toBe(true);
    expect(iconButtonLabelRequired).toBe(true);
    expect(iconButtonChildrenRequired).toBe(true);
  });

  it('guards against the button base type silently dropping the forbidden props', () => {
    const controlForbiddenPropsExistOnButtonBase: ControlForbiddenPropsExistOnButtonBase = true;

    expect(controlForbiddenPropsExistOnButtonBase).toBe(true);
  });

  it('guards against the router link base type silently dropping the forbidden props', () => {
    const linkForbiddenPropsExistOnRouterBase: LinkForbiddenPropsExistOnRouterBase = true;

    expect(linkForbiddenPropsExistOnRouterBase).toBe(true);
  });
});
