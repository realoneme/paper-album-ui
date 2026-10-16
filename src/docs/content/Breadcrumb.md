# Breadcrumb

Where you are: links to parents, the current page in bold, long trails collapsed into an ellipsis button.

- React: `Breadcrumb` (`nav`, `aria-label` defaults to "Breadcrumb"), `BreadcrumbList` (`ol`), `BreadcrumbItem`, `BreadcrumbLink` (`asChild` for router links), `BreadcrumbPage` (`aria-current="page"`), `BreadcrumbSeparator` (chevron by default; pass `/` as children), `BreadcrumbEllipsis` (button "Show hidden levels") from `@/components/ui/breadcrumb`.

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Lisbon mornings</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```
