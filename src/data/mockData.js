export const suppliers = [
  { id: 's1', name: 'Booking.com', propertyCount: 12 },
  { id: 's2', name: 'Expedia Group', propertyCount: 8 },
  { id: 's3', name: 'Hotelbeds', propertyCount: 15 },
  { id: 's4', name: 'SiteMinder', propertyCount: 6 },
];

/** Returns all properties from all suppliers with supplierId, for search. */
export const getAllProperties = () => {
  return suppliers.flatMap((s) =>
    getPropertiesBySupplier(s.id).map((p) => ({ ...p, supplierId: s.id, supplierName: s.name }))
  )
}

/** Search properties by name or ID (substring match, case-insensitive). */
export const searchProperties = (query) => {
  if (!query || !String(query).trim()) return getAllProperties()
  const q = String(query).trim().toLowerCase()
  return getAllProperties().filter(
    (p) =>
      String(p.name).toLowerCase().includes(q) ||
      String(p.id).toLowerCase().includes(q) ||
      String(p.location).toLowerCase().includes(q)
  )
}

export const getPropertiesBySupplier = (supplierId) => {
  const all = {
    s1: [
      { id: 166682, name: 'Hotel Holt', priceCoverage: '22.1%', matchStatus: 'Matched', location: 'IS (Iceland)', liveOnGoogle: true },
      { id: 166683, name: 'Reykjavik Marina Hotel', priceCoverage: '45.2%', matchStatus: 'Matched', location: 'IS (Iceland)', liveOnGoogle: true },
      { id: 166684, name: 'International au Lac Historic Lakeside Hotel', priceCoverage: '18.5%', matchStatus: 'Unmatched', location: 'CH (Switzerland)', liveOnGoogle: false },
      { id: 166685, name: 'Grand Hotel Reykjavik', priceCoverage: '67.0%', matchStatus: 'Matched', location: 'IS (Iceland)', liveOnGoogle: true },
    ],
    s2: [
      { id: 200001, name: 'Nordic House', priceCoverage: '33.0%', matchStatus: 'Matched', location: 'IS (Iceland)', liveOnGoogle: true },
      { id: 200002, name: 'City Center Hotel', priceCoverage: '28.5%', matchStatus: 'Matched', location: 'NO (Norway)', liveOnGoogle: true },
    ],
    s3: [
      { id: 300001, name: 'Mountain View Lodge', priceCoverage: '55.0%', matchStatus: 'Matched', location: 'CH (Switzerland)', liveOnGoogle: true },
      { id: 300002, name: 'Lakeside Inn', priceCoverage: '12.0%', matchStatus: 'Unmatched', location: 'AT (Austria)', liveOnGoogle: false },
    ],
    s4: [
      { id: 400001, name: 'Alpine Resort', priceCoverage: '90.0%', matchStatus: 'Matched', location: 'CH (Switzerland)', liveOnGoogle: true },
    ],
  };
  return all[supplierId] || [];
};

export const getPropertyDetails = (propertyId) => {
  const props = {
    166682: { id: 166682, name: 'Hotel Holt', address: 'Bergstaðastræti 37, 101 Reykjavík', country: 'Iceland', currency: 'ISK', timezone: 'Atlantic/Reykjavik' },
    166683: { id: 166683, name: 'Reykjavik Marina Hotel', address: 'Mýrargata 2, 101 Reykjavík', country: 'Iceland', currency: 'ISK', timezone: 'Atlantic/Reykjavik' },
    166684: { id: 166684, name: 'International au Lac Historic Lakeside Hotel', address: 'Riva Albertolli 1, 6900 Lugano', country: 'Switzerland', currency: 'CHF', timezone: 'Europe/Zurich' },
    166685: { id: 166685, name: 'Grand Hotel Reykjavik', address: 'Sigtún 38, 105 Reykjavík', country: 'Iceland', currency: 'ISK', timezone: 'Atlantic/Reykjavik' },
    200001: { id: 200001, name: 'Nordic House', address: 'Laugavegur 18, 101 Reykjavík', country: 'Iceland', currency: 'ISK', timezone: 'Atlantic/Reykjavik' },
    200002: { id: 200002, name: 'City Center Hotel', address: 'Storgata 1, 0182 Oslo', country: 'Norway', currency: 'NOK', timezone: 'Europe/Oslo' },
    300001: { id: 300001, name: 'Mountain View Lodge', address: 'Dorfstrasse 10, 3818 Grindelwald', country: 'Switzerland', currency: 'CHF', timezone: 'Europe/Zurich' },
    300002: { id: 300002, name: 'Lakeside Inn', address: 'Seestrasse 20, 5310 Mondsee', country: 'Austria', currency: 'EUR', timezone: 'Europe/Vienna' },
    400001: { id: 400001, name: 'Alpine Resort', address: 'Hauptstrasse 5, 7250 Klosters', country: 'Switzerland', currency: 'CHF', timezone: 'Europe/Zurich' },
  };
  return props[propertyId] || null;
};

const defaultRoomTypes = [
  { roomTypeId: 163086, name: 'Triple Room', description: '<p>Triple Room TP</p>', capacity: 3, ratePlans: 'All rate plans', hasPhoto: true },
  { roomTypeId: 163100, name: 'Double Room', description: '<p>Double Room DP</p>', capacity: 2, ratePlans: 'All rate plans', hasPhoto: true },
  { roomTypeId: 193876, name: 'Double room with Balcony DPB', description: '<p>Double room with Balcony DPB</p>', capacity: 2, ratePlans: 'All rate plans', hasPhoto: true },
  { roomTypeId: 193878, name: '', description: '', capacity: '-', ratePlans: 'All rate plans', hasPhoto: false },
  { roomTypeId: 163096, name: '', description: '', capacity: '-', ratePlans: 'All rate plans', hasPhoto: false },
];

/** Room types for Room & Rate Plans → Rooms tab (Photos, Room type ID, Name(s), Description(s), Capacity, Rate plans). */
export const getRoomTypes = (propertyId) => {
  return defaultRoomTypes;
};

const defaultRatePlansList = [
  { ratePlanId: 549300, name: 'BOOKING Triple Room Standard Rate', description: '<p>BOOKING Triple Room Standard Rate</p>', refundable: 'Yes, until 1 day before check in at 12:00 AM', roomTypes: 'Triple Room (ID: 163086)' },
  { ratePlanId: 549306, name: 'BOOKING Double Room Standard Rate', description: '<p>BOOKING Double Room Standard Rate</p>', refundable: 'Yes, until 1 day before check in at 12:00 AM', roomTypes: 'Double Room (ID: 163100)' },
  { ratePlanId: 549316, name: 'BOOKING Triple Room NonRefundable', description: '<p>BOOKING Triple Room NonRefundable</p>', refundable: 'Yes, until 1 day before check in at 12:00 AM', roomTypes: 'Triple Room (ID: 163086)' },
  { ratePlanId: 549322, name: 'BOOKING Double Room NonRefundable', description: '<p>BOOKING Double Room NonRefundable</p>', refundable: 'Yes, until 1 day before check in at 12:00 AM', roomTypes: 'Double Room (ID: 163100)' },
  { ratePlanId: 706850, name: 'BOOKING Double Room with Balcony Standard Rate', description: 'BOOKING Double Room with Balcony Standard Rate', refundable: 'Yes, until 1 day before check in at 12:00 AM', roomTypes: 'Double room with Balcony DPB (ID: 193876)' },
  { ratePlanId: 706852, name: 'BOOKING Double Room with Balcony Non Refundable', description: 'BOOKING Double Room with Balcony Non Refundable', refundable: 'Yes, until 1 day before check in at 12:00 AM', roomTypes: 'Double room with Balcony DPB (ID: 193876)' },
  { ratePlanId: 706860, name: '', description: '', refundable: '', roomTypes: '193878' },
];

/** Rate plans for Room & Rate Plans → Rate plans tab (Name(s), Rate plan ID, Description(s), Refundable, Room types). */
export const getRatePlansList = (propertyId) => {
  return defaultRatePlansList;
};

export const getAvailabilityPrices = (propertyId) => {
  return [
    { date: '2025-02-17', available: true, price: 25000, currency: 'ISK' },
    { date: '2025-02-18', available: true, price: 26500, currency: 'ISK' },
    { date: '2025-02-19', available: false, price: null, currency: 'ISK' },
    { date: '2025-02-20', available: true, price: 28000, currency: 'ISK' },
  ];
};

/** Overall availability: room/rate plan overview for Availability page (upper table). */
export const getOverallAvailability = () => {
  const roomIds = ['DZ_Large_1', 'DZ_Large_2', 'DZ_Maisonette_1', 'DZ_Medium_1', 'DZ_Medium_2', 'DZ_Small_1', 'DZ_Small_2', 'DZ_cozy_1', 'DZ_cozy_2', 'DZ_Studio_1', 'DZ_Studio_2', 'DZ_Large_3', 'DZ_Maisonette_2', 'DZ_Medium_3', 'DZ_Small_3', 'DZ_cozy_3', 'DZ_Studio_3', 'DZ_Large_4', 'DZ_Medium_4', 'DZ_Small_4', 'DZ_cozy_4', 'DZ_Studio_4', 'DZ_Large_5', 'DZ_Medium_5'];
  return roomIds.map((roomId, i) => ({
    roomId,
    ratePlanId: 'rack',
    roomInventoryDays: i % 2 === 0 ? 318 : 311,
    roomMapped: 'Yes',
    ratePlanMapped: 'Yes',
    combinationAllowed: 'Yes',
    openAvailabilityDays: 366,
    occupancy1: roomId === 'DZ_Large_1' ? 366 : roomId === 'DZ_Large_2' ? 0 : 366,
    occupancy2: roomId === 'DZ_Large_2' ? 366 : 0,
    occupancy3: 0,
    occupancy4: 0,
    occupancy5: 0,
    occupancy6: 0,
    occupancy7: 0,
    occupancy8: 0,
    occupancy9: 0,
    occupancy10: 0,
    childOccupancy: 0,
  }));
};

/** Property-level availability summary for the Property tab (single row: totals and occupancy days). */
export const getPropertyLevelAvailability = () => {
  const rows = getOverallAvailability()
  const totalRooms = rows.length
  const roomMapped = Math.max(0, totalRooms - 1)
  const ratePlanIds = [...new Set(rows.map((r) => r.ratePlanId))]
  const totalRatePlans = ratePlanIds.length
  const ratePlanMapped = totalRatePlans
  const openAvailabilityDays = rows[0]?.openAvailabilityDays ?? 366
  return {
    totalRooms,
    roomMapped,
    totalRatePlans,
    ratePlanMapped,
    openAvailabilityDays,
    occupancy1: 366,
    occupancy2: 366,
    occupancy3: 366,
    occupancy4: 317,
    occupancy5: 0,
    occupancy6: 0,
    occupancy7: 0,
    occupancy8: 0,
  }
}

/** Daily availability: expandable rows with date columns (lower table). Returns { roomRows, dateColumns }. */
export const getDailyAvailability = (startDate, endDate) => {
  const dates = [];
  const d = new Date(startDate);
  const end = new Date(endDate);
  while (d <= end) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  const dateColumns = dates.map((dt) => ({
    key: dt.toISOString().slice(0, 10),
    label: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
  }));
  const roomRows = [
    { roomId: 'DZ_Large_1', ratePlan: 'rack', occupancy: 1, dailyValues: [3, 3, 0, 0, 4, 3, 0, 1, 2, 0, 0, 4, 1, 0] },
    { roomId: 'DZ_Large_2', ratePlan: 'rack', occupancy: 2, dailyValues: [3, 3, 0, 0, 4, 3, 0, 1, 2, 0, 0, 4, 1, 0] },
    { roomId: 'DZ_Maisonette_1', ratePlan: 'rack', occupancy: 1, dailyValues: [1, 2, 1, 0, 2, 1, 1, 0, 1, 2, 0, 1, 0, 1] },
    { roomId: 'DZ_Medium_1', ratePlan: 'rack', occupancy: 1, dailyValues: [2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2] },
  ];
  const numDays = dateColumns.length;
  const pad = (arr, len) => arr.length >= len ? arr.slice(0, len) : [...arr, ...Array(len - arr.length).fill(0)];
  return {
    roomRows: roomRows.map((r) => ({ ...r, dailyValues: pad(r.dailyValues, numDays) })),
    dateColumns,
  };
};

export const getInventory = (propertyId) => {
  return [
    { roomType: 'Standard Double', ratePlan: 'Best Flexible', total: 10, sold: 3, available: 7 },
    { roomType: 'Deluxe Double', ratePlan: 'Non-Refundable', total: 5, sold: 5, available: 0 },
    { roomType: 'Suite', ratePlan: 'Corporate', total: 2, sold: 0, available: 2 },
  ];
};

export const getTaxes = (propertyId) => {
  const taxes = {
    166682: [
      { id: 't1', name: 'VAT', rate: '11%', type: 'Percentage', included: false },
      { id: 't2', name: 'Tourist Tax', rate: 'Fixed 500 ISK', type: 'Fixed', included: false },
    ],
    166683: [
      { id: 't3', name: 'VAT', rate: '11%', type: 'Percentage', included: true },
    ],
  };
  return taxes[propertyId] || [];
};

/** Promotions for the Promotion tab. */
export const getPromotions = (propertyId) => {
  return [
    {
      id: 'PROMO-001',
      discountType: 'Percentage',
      discount: '15%',
      roomTypes: 'Double Room, Triple Room',
      ratePlans: 'Standard Rate, Non-Refundable',
      devices: 'Desktop, Mobile',
      countriesIncluded: 'IS, NO, SE, DK',
      countriesExcluded: '—',
    },
    {
      id: 'PROMO-002',
      discountType: 'Fixed amount',
      discount: '2,500 ISK',
      roomTypes: 'Suite',
      ratePlans: 'Corporate',
      devices: 'All',
      countriesIncluded: 'All',
      countriesExcluded: '—',
    },
    {
      id: 'PROMO-003',
      discountType: 'Percentage',
      discount: '10%',
      roomTypes: 'All room types',
      ratePlans: 'All rate plans',
      devices: 'Mobile',
      countriesIncluded: 'IS',
      countriesExcluded: '—',
    },
  ];
};
