import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageContainer } from '@/shared/ui';

const LANDMARK_ROLES = ['banner', 'contentinfo', 'main', 'navigation', 'region', 'complementary'];

describe('PageContainer', () => {
  it('renders provided content', () => {
    render(<PageContainer>Container content</PageContainer>);

    expect(screen.getByText('Container content')).toBeInTheDocument();
  });

  it('renders a div root by default', () => {
    const { container } = render(<PageContainer>content</PageContainer>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('div');
  });

  it('renders the requested semantic root element', () => {
    const { container } = render(<PageContainer as="section">content</PageContainer>);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('section');
  });

  it('creates no landmark or heading semantics by default', () => {
    render(<PageContainer>content</PageContainer>);

    for (const role of LANDMARK_ROLES) {
      expect(screen.queryAllByRole(role)).toHaveLength(0);
    }
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('creates a landmark only when the consumer selects one', () => {
    render(<PageContainer as="main">content</PageContainer>);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('preserves consumer identity and aria attributes on the root', () => {
    render(
      <PageContainer id="page-root" aria-label="Page region">
        content
      </PageContainer>
    );

    const root = document.getElementById('page-root');

    expect(root).not.toBeNull();
    expect(root?.getAttribute('aria-label')).toBe('Page region');
  });

  it('preserves a consumer className on the root', () => {
    const { container } = render(<PageContainer className="consumer-hook">content</PageContainer>);

    expect(container.firstElementChild?.classList.contains('consumer-hook')).toBe(true);
  });

  it('preserves child DOM order', () => {
    const { container } = render(
      <PageContainer>
        <span>one</span>
        <span>two</span>
        <span>three</span>
      </PageContainer>
    );

    const order = Array.from(container.firstElementChild?.children ?? []).map(
      (child) => child.textContent
    );

    expect(order).toEqual(['one', 'two', 'three']);
  });

  it('accepts every documented width role without changing semantics', () => {
    const { container: contentContainer } = render(
      <PageContainer width="content">a</PageContainer>
    );
    const { container: textContainer } = render(<PageContainer width="text">b</PageContainer>);

    expect(contentContainer.firstElementChild?.tagName.toLowerCase()).toBe('div');
    expect(textContainer.firstElementChild?.tagName.toLowerCase()).toBe('div');
  });
});
