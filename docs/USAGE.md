## Usage

![Dashboard Snapshot](/images/snapshot.png)

### General
Stats at the top are specific to a customer regardless of the timeframe.

All panels are relative to the customer and timeframe.

The tickets table at the bottom is filtered by the customer, timeframe and any selection made in any of the panels.

### UI
* Sidebar: use the sidebar to select a focus customer or a specific customer.
    - To search all customers use the first search bar.
    - Use the second search bar to find a focus customer.
* Stats: at the top of the dashboard there is data on the customer (Name, # of Tickets and Avg Days to Resolve Ticket).
* Status bar graph / Status pie chart:
    - Note: the status field is not available in Rally it is produced as a combination of L3KanbanStage and Project Name.
    - Click on one of the bars or pie pieces to filter the tickets table by status.
* Projects panel: click on a project to filter the tickets.
    - iHotelier includes all tickets under "Reservations" or "Reservations"
    - Note: ideally we would like to filter by product, however there is no good way to map products to Rally projecs so we only provide these two options.
* Regions panel: click on one or multiple regions to filter the tickets.
* Tickets table:
    - Tickets can be filtered based on user selections in any of the panels and are listed at the bottom of the page.
    - Functionality: sort by a specific column or export to csv.