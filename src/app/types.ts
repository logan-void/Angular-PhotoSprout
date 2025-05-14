export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    id: string;
    username: string;
  };
}
