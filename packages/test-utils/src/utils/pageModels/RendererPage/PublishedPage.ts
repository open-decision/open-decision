import { TCreatePublishedTreeOutput } from "@open-decision/api-specification";
import { Page } from "@playwright/test";
import { TreeFixture } from "../../../fixtures/Tree";
import { UserFixture } from "../../../fixtures/User";
import { proxiedPlaywrightOD } from "../../playwright/APIClient";
import { createDashboardPage } from "../DashboardPage";
import { RendererPage } from "./RendererPage";

export interface PublishedPageFixtures {
  Tree: TreeFixture;
  User: UserFixture;
}

export interface PublishedPageData {
  publishedTree: TCreatePublishedTreeOutput;
}

export class PublishedPage extends RendererPage {
  async goto() {
    await this.page.goto(`/public/${this.tree.uuid}`);
  }
}

export const createPublishedPage = async (page: Page) => {
  const UserClass = new UserFixture();
  const TreeClass = new TreeFixture(await proxiedPlaywrightOD(page.request));

  const dashboardPage = await createDashboardPage(page, {
    Tree: TreeClass,
    User: UserClass,
  });

  return new PublishedPage({
    ...dashboardPage,
    page,
    tree: dashboardPage.trees.publishedTree,
  });
};
