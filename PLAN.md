# Background:

Gambit monitors an organization's cloud resources (buckets, databases, compute, IAM roles).
An Application is a named, logical group of resources (e.g. “Payments API”).
Build a small UI to browse the resources below, group a selection into a new Application, and view the Applications
created.
No backend - hold state in the client.

# Data Model

```
type Provider = 'AWS' | 'GCP' | 'Azure';
type Environment = 'production' | 'staging' | 'development';
type Criticality = 'low' | 'medium' | 'high' | 'critical';

interface Resource {
  id: string;
  name: string;
  type: string; // e.g. "S3 Bucket", "IAM Role"
  provider: Provider;
  region: string;
  environment: Environment;
  criticality: Criticality;
  owner: string;
  tags: string[];
}

interface Application {
  id: string;
  name: string;
  description?: string;
  resourceIds: string[];
}
```

# Requirements

## Data

Build a small dataset of 12 resources with a rich variety of providers, environments, and criticality in order to make
searching, filtering, and grouping more meaningful.

## Pages (integrate react-router)

- Resources page
- Applications page

### Resources page

- Display resources in a table using Mantine React Table, display all columns.
- The table columns should be resizeable.
- Filter/Sort/Pagination: no pagination, search by name and filter sort by all other columns.
-
    - searching should be debounced.
    - all filter sort args should be synced with URL, so they remain on page refresh. 
- Selection UX:
-
    - click on a row in order to select it
-
    - when at least one is selected, display a sticky footer with all the selected resource names and a button to create
      a named Application from the selection.
-
    - on create application button click, open a modal with name input and submit button that will create the new
      application, the button is disabled until a name is entered.

### Applications page

- Applications should be saved in Local Storage.
- Display applications in a table using Mantine React Table, display all columns.
- The table columns should be resizeable.
- On row click, open modal that visualizes an Application as a simple graph, use SVG to render a central Application
  node connected to its member resource nodes.
- - on resource node click, navigate to the resources page with a search filter passed from the URL to show this specific resource.
