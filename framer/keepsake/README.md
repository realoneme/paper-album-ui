# Keepsake (Framer template) build scripts

The Keepsake site in the Framer project (wedding, family and portrait photographers; albums you can order) was
built with these generators. Each prints a phased DSL file for `framer/apply2.sh` (phases separated by `---`;
temporary ids from earlier phases are resolved). They record how the site was put together and can rebuild a page
on a fresh breakpoint, but the node and variable ids inside them belong to project EQa7P1wtcypuEsqWH8wK.

| Script | Builds |
|---|---|
| `b.py` | the DSL builder: Paper colour tokens, paper shadows, code-component control bindings |
| `common.py` | CMS field ids, section/heading helpers, native form fields styled as sunken paper, the Submit button |
| `cms_gen.py` | CMS: Albums (with a Photos list and a Story), Testimonials, Packages |
| `layout.py`, `navphone.py` | the Nav component (Desktop, Phone, Phone Open drawer) and the Main layout template with the footer |
| `submit.py` | `Paper/Submit`, the form button with Pending, Success, Error and Incomplete states |
| `home.py` … `about.py` | the pages (about.py also builds 404 and Away) |
| `resp.py` | Tablet (810) and Phone (390) breakpoints for every page |
| `shot.sh`, `tile.py` | screenshots of a node, and tiling tall phone screenshots for review |

Placeholder photographs come from Unsplash and are replaced with the template's own images before release.
