/**
 * A utility React component for setting the document's `<title>` element.
 *
 * This component performs a side effect by updating `document.title` on each render,
 * ensuring that the page title always matches the `title` prop.
 *
 * @example
 * ```tsx
 * <PageTitle title="Holidaze | Homepage" />
 * ```
 *
 * @param {Object} props - The props object.
 * @param {string} props.title - The text to set as the page title.
 *
 * @returns {null} This component does not render any visible UI.
 */
export function PageTitle({ title }: { title: string }) {
  document.title = title;
  return null;
}
