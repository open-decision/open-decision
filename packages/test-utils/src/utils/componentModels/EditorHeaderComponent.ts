import { Page } from "@playwright/test";
import { HeaderComponent } from "./HeaderComponent";
import { NodeSearch } from "./NodeSearch";
import { ProjectMenuComponent } from "./ProjectMenuComponent";
import { PreviewDialogComponent } from "./PrototypeDialogComponent";

export class EditorHeaderComponent extends HeaderComponent {
  readonly title: string;
  readonly nodeSearch: NodeSearch;
  readonly projectMenuDropdown: ProjectMenuComponent;
  readonly prototypeDialog: PreviewDialogComponent;

  constructor(page: Page, title: string) {
    super(page);

    this.title = title;
    this.nodeSearch = new NodeSearch(page);
    this.projectMenuDropdown = new ProjectMenuComponent(page, title);
    this.prototypeDialog = new PreviewDialogComponent(page);
  }
}
