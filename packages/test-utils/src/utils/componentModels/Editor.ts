import { de } from "@open-decision/translations";
import { Locator, Page } from "@playwright/test";
import { translate } from "../internationalize";

export class EditorComponent {
  readonly page: Page;
  readonly createNodeButton: Locator;
  readonly canvas: Locator;
  readonly zoomOutButton: Locator;
  readonly zoomInButton: Locator;
  readonly fitViewButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createNodeButton = page.locator(
      `role=button[name="${de.builder.createNodeButton.hiddenLabel}"]`
    );
    this.canvas = page.locator(`[data-test=canvas]`);
    this.zoomOutButton = page.locator(
      `role=button[name="${de.builder.canvas.zoomInAndOut.zoomOut.hiddenLabel}"]`
    );
    this.zoomInButton = page.locator(
      `role=button[name="${de.builder.canvas.zoomInAndOut.zoomIn.hiddenLabel}"]`
    );
    this.fitViewButton = page.locator(
      `role=button[name="${de.builder.canvas.zoomInAndOut.fitView.hiddenLabel}"]`
    );
  }

  getNodeLocator(
    { content, selected = true }: { content?: string; selected?: boolean } = {
      content: undefined,
      selected: true,
    }
  ) {
    return this.page.locator(
      `[aria-label="${translate(
        de.builder.canvas.questionNode.empty.hiddenLabel
      )({
        content: (content?.length ?? 0) > 0,
        name: content,
        selected,
      })}"]`
    );
  }

  getEdgeLocator(uuid: string) {
    return this.page.locator(`data-test=${uuid}_edge`);
  }

  async selectNode(
    { content, selected }: { content?: string; selected: boolean } = {
      content: undefined,
      selected: true,
    }
  ) {
    this.getNodeLocator({ content, selected }).click();
  }

  getSidebarLocator() {
    return this.page.locator(`aside >> label >> text='Knotenname'`);
  }

  async pan(x: number, y: number) {
    const canvasBoundingBox = await this.canvas.boundingBox();

    if (!canvasBoundingBox) throw new Error("Canvas not found");

    await this.page.mouse.move(canvasBoundingBox.x, canvasBoundingBox.y);
    await this.page.mouse.down();
    await this.page.mouse.move(x, y);
    await this.page.mouse.up();
  }

  async zoom(amount: number) {
    const canvasBoundingBox = await this.canvas.boundingBox();

    if (!canvasBoundingBox) throw new Error("Canvas not found");

    await this.page.mouse.move(canvasBoundingBox.x, canvasBoundingBox.y);
    await this.page.keyboard.down("Control");
    await this.page.mouse.wheel(0, amount);
    await this.page.keyboard.up("Control");
  }
}
