import { render } from '@testing-library/react';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import { WEBSITE_NAME } from '@/constants';

describe('Testing html head content helper', () => {
  it('Should be able to render with a custom title when provided', () => {
    const { container } = render(htmlHeadContentHelper({ title: 'Custom Title' }));

    const titleElement = container.querySelector('title');
    expect(titleElement).not.toBeNull();
    expect(titleElement!.textContent).toBe(`Custom Title | ${WEBSITE_NAME}`);

    const metaElement = container.querySelector('meta[name="viewport"]');
    expect(metaElement).not.toBeNull();
    expect(metaElement!.getAttribute('content')).toBe('width=device-width, initial-scale=1');
  });

  it('Should be able to render with the default title when no title is provided', () => {
    const { container } = render(htmlHeadContentHelper({}));

    const titleElement = container.querySelector('title');
    expect(titleElement).not.toBeNull();
    expect(titleElement!.textContent).toBe(WEBSITE_NAME);

    const metaElement = container.querySelector('meta[name="viewport"]');
    expect(metaElement).not.toBeNull();
    expect(metaElement!.getAttribute('content')).toBe('width=device-width, initial-scale=1');
  });
});