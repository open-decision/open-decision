import { Locator, Page } from "@playwright/test";
import { de } from "@open-decision/translations";
import { CreateProjectDialogComponent } from "../componentModels/CreateProjectDialogComponent";
import { HeaderComponent } from "../componentModels/HeaderComponent";
import { NotificationComponent } from "../componentModels/NotificationComponent";
import { ProjectMenuComponent } from "../componentModels/ProjectMenuComponent";
import { TUser, UserFixture } from "../../fixtures/User";
import { TreeFixture, createDefaultSetOfTrees } from "../../fixtures/Tree";
import { proxiedPlaywrightOD } from "../playwright/odClient";
import { PartialTree } from "../../fixtures";
import { TCreatePublishedTreeOutput } from "@open-decision/api-specification";

export class DashboardPage<
  TTrees extends Record<string, PartialTree | TCreatePublishedTreeOutput> = any
> {
  readonly page: Page;
  readonly dataFixtures: { User: UserFixture; Tree: TreeFixture };
  readonly filterButton: Locator;
  readonly sortButton: Locator;
  readonly createProjectDropdown: Locator;
  readonly createProjectDialog: CreateProjectDialogComponent;
  readonly notification: NotificationComponent;
  readonly header: HeaderComponent;
  readonly user: TUser;
  readonly searchInput: Locator;
  readonly trees: TTrees;

  constructor(
    page: Page,
    user: TUser,
    trees: TTrees,
    DataFixtures: { User: UserFixture; Tree: TreeFixture }
  ) {
    this.page = page;
    this.user = user;
    this.trees = trees;
    this.dataFixtures = DataFixtures;
    this.filterButton = page.locator(`text=Filter`);
    this.sortButton = page.locator(`text=Sortieren`);
    this.createProjectDropdown = page.locator(`text=Projekt erstellen`);
    this.createProjectDialog = new CreateProjectDialogComponent(page);
    this.notification = new NotificationComponent(page);
    this.header = new HeaderComponent(page);
    this.searchInput = page.locator(
      `[placeholder="${de.dashboard.treeList.search.placeholder}"]`
    );
  }

  async goto() {
    await this.page.goto("/");
  }

  async cleanup() {
    await this.dataFixtures.Tree.cleanup();
    await this.dataFixtures.User.cleanup();
  }

  async openCreateProjectDropdown() {
    await this.createProjectDropdown.click();
  }

  async openCreateProjectDialog() {
    await this.openCreateProjectDropdown();
    await this.page
      .locator(`text=${de.common.NewProjectDropdown.createProjectLabel}`)
      .click();
  }

  async createProject(title: string) {
    this.openCreateProjectDialog();

    await this.createProjectDialog.createProject(title);
  }

  async openImportProjectDialog() {
    await this.openCreateProjectDropdown();
    await this.page
      .locator(`text=${de.common.NewProjectDropdown.importProject.label}`)
      .click();
  }

  async importProject(filePath: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.openImportProjectDialog(),
    ]);

    await fileChooser.setFiles(filePath);
  }

  async filterByActive() {
    await this.filterButton.click();
    await this.page.locator(`role=menuitemcheckbox >> text=Aktiv`).click();
  }

  async filterByPublished() {
    await this.filterButton.click();
    await this.page
      .locator(`role=menuitemcheckbox >> text=Veröffentlicht`)
      .click();
  }

  async filterByArchived() {
    await this.filterButton.click();
    await this.page.locator(`role=menuitemcheckbox >> text=Archiviert`).click();
  }

  async sortByCreationDateAscending() {
    await this.sortButton.click();
    await this.page
      .locator(`role=menuitemcheckbox >> text=Aufsteigend`)
      .click();
  }

  async sortByCreationDateDescending() {
    await this.sortButton.click();
    await this.page
      .locator(`role=menuitemcheckbox >> text=Erstellungsdatum`)
      .click();
    await this.sortButton.click();
    await this.page.locator(`role=menuitemcheckbox >> text=Absteigend`).click();
  }

  async sortByLastEditedAscending() {
    await this.sortButton.click();
    await this.page
      .locator(`role=menuitemcheckbox >> text=Zuletzt bearbeitet`)
      .click();
    await this.sortButton.click();
    await this.page
      .locator(`role=menuitemcheckbox >> text=Aufsteigend`)
      .click();
  }

  async sortByLastEditedDescending() {
    await this.sortButton.click();
    await this.page
      .locator(`role=menuitemcheckbox >> text=Zuletzt bearbeitet`)
      .click();
    await this.sortButton.click();
    await this.page.locator(`role=menuitemcheckbox >> text=Absteigend`).click();
  }

  getProjectCardLocator(title: string) {
    return this.page.locator(`h2 >> text=${title}`);
  }

  getProjectCardLabels(title: string) {
    return this.page.locator(`section >> header`, {
      hasText: title,
    });
  }

  getProjectMenuDropdown(title: string) {
    return new ProjectMenuComponent(this.page, title);
  }

  async openProject(title: string) {
    await Promise.all([
      this.page.waitForNavigation(),
      this.getProjectCardLocator(title).click(),
    ]);
  }

  async search(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }
}

export async function createDashboardPage(
  page: Page,
  fixtures?: { User?: UserFixture; Tree?: TreeFixture }
) {
  const User = fixtures?.User ? fixtures.User : new UserFixture();
  const Tree = fixtures?.Tree
    ? fixtures.Tree
    : new TreeFixture(await proxiedPlaywrightOD(page.request));
  const user = await User.insert();

  await page.request.post(`/api/external-api/auth/login`, {
    data: { email: user.email, password: user.password },
  });

  const trees = await createDefaultSetOfTrees(Tree, user);

  return new DashboardPage(page, user, trees, { User, Tree });
}
