export const materialsNotifications = Array.from(
  { length: 20 },
  (_, index) => ({
    title: `Raw Material Inspection Required ${index + 1}`,
    description: 'New shipment of steel plates needs inspection',
    time: `${8 + index}h`,
    read: index % 2 === 0,
  })
);

export const productsNotifications = Array.from({ length: 20 }, (_, index) => ({
  title: `Product Quality Check ${index + 1}`,
  description: 'Quality inspection needed for batch 234',
  time: `${1 + index}d`,
  read: index % 2 !== 0,
}));
