import { All_TreesQuery } from "@internalTypes/generated/graphql";

export const data: All_TreesQuery = {
  allDecisionTrees: {
    edges: [
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Test",
          id: "45679569",
          slug: "",
          createdAt: "2020-11-11T12:50:51+0000",
          tags:
            '[{"name":"Unfertig","color":"blue"}, {"name":"Draft","color":"green"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Test2",
          id: "5348765867",
          slug: "",
          createdAt: "2020-11-11T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Fehlerhaft","color":"red"}, {"name":"Another","color":"purple"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Hello world",
          id: "34563458765",
          slug: "",
          createdAt: "2020-11-11T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Unfertig","color":"orange"}, {"name":"System","color":"pink"},{"name":"Uncreative","color":"teal"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Whatever",
          id: "6597859678",
          slug: "",
          createdAt: "2020-11-11T12:50:51+0000",
          tags: '[{"name":"Archiv","color":"yellow"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "The nicest one",
          id: "2365438756",
          slug: "",
          createdAt: "2005-12-11T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Fehlerhaft","color":"red"}, {"name":"Unfertig","color":"orange"},{"name":"Uncreative","color":"teal"},{"name":"Another","color":"purple"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Another Tree????",
          id: "345763567",
          slug: "",
          createdAt: "2020-11-03T12:50:51+0000",
          tags:
            '[{"name":"Unfertig","color":"orange"}, {"name":"Draft","color":"indigo"}, {"name":"System","color":"pink"},{"name":"Uncreative","color":"teal"},{"name":"Another","color":"purple"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "So many trees :(",
          id: "80-77890",
          slug: "",
          createdAt: "2015-01-19T12:50:51+0000",
          tags:
            '[ {"name":"Unfertig","color":"orange"}, {"name":"Draft","color":"indigo"}, {"name":"Uncreative","color":"teal"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Quark",
          id: "45748678",
          slug: "",
          createdAt: "2000-11-11T12:50:51+0000",
          tags: '[{"name":"Another","color":"purple"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Butter",
          id: "567957689",
          slug: "",
          createdAt: "2018-09-20T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Draft","color":"indigo"}, {"name":"System","color":"pink"},{"name":"Uncreative","color":"teal"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Haus",
          id: "5346754678",
          slug: "",
          createdAt: "2020-10-11T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Fehlerhaft","color":"red"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Supermarkt",
          id: "142351456",
          slug: "",
          createdAt: "2010-11-11T12:50:51+0000",
          tags:
            '[{"name":"Unfertig","color":"orange"}, {"name":"Draft","color":"indigo"},{"name":"Uncreative","color":"teal"},{"name":"Another","color":"purple"}]',
        },
      },
    ],
  },
};
