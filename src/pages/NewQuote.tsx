import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Input, Select } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type ItemField =
  | "units"
  | "handlingUnit"
  | "pieces"
  | "weight"
  | "weightUnit"
  | "freightClass"
  | "length"
  | "width"
  | "height"
  | "dimensionUnit"
  | "nmfc"
  | "description";

type QuoteItem = Record<ItemField, string> & {
  id: string;
};

type QuotePackage = {
  id: string;
  items: QuoteItem[];
};

let quoteEntityId = 0;

const createId = (prefix: string) => `${prefix}-${++quoteEntityId}`;

const createItem = (): QuoteItem => ({
  id: createId("item"),
  units: "1",
  handlingUnit: "Pallet",
  pieces: "1",
  weight: "864",
  weightUnit: "lbs",
  freightClass: "50",
  length: "",
  width: "",
  height: "",
  dimensionUnit: "in.",
  nmfc: "",
  description: "",
});

const createPackage = (): QuotePackage => ({
  id: createId("package"),
  items: [createItem()],
});

const accessorialOptions = [
  "Blind Shipment",
  "Call Before Delivery",
  "Call Before Pickup",
  "Delivery Appointment",
  "Guaranteed By 5PM",
  "Inside Delivery",
  "Inside Pickup",
  "Liftgate Delivery",
  "Liftgate Pickup",
  "Limited Access Delivery",
  "Limited Access Pickup",
  "Protect From Freeze",
  "Residential Delivery",
  "Residential Pickup",
  "Sort & Segregate",
  "Trade Show Delivery",
  "Trade Show Pickup",
];

const countryOptions = [{ value: "United States", label: "United States" }];
const handlingUnitOptions = ["Pallet", "Crate", "Carton", "Drum", "Piece"].map(
  (value) => ({ value, label: value }),
);
const classOptions = ["50", "55", "60", "65", "70", "77.5", "85", "92.5", "100", "110", "125", "150", "175", "200", "250", "300", "400", "500"].map(
  (value) => ({ value, label: value }),
);

function QuoteLocationCard({
  title,
  zipLabel,
  includeDate = false,
}: {
  title: string;
  zipLabel: string;
  includeDate?: boolean;
}) {
  return (
    <section className='new-quote-card quote-location-card'>
      <header className='new-quote-card__header'>
        <h2>{title}</h2>
        <Button size='small' icon={<TeamOutlined />}>
          Address Book
        </Button>
      </header>
      <div className='quote-location-card__body'>
        {includeDate ? (
          <label className='new-quote-field quote-location-card__date'>
            <span>Pickup Date</span>
            <Input type='date' aria-label='Pickup date' />
          </label>
        ) : null}
        <label className='new-quote-field'>
          <span>{zipLabel}</span>
          <Input defaultValue='02854' aria-label={zipLabel} />
        </label>
        <label className='new-quote-field'>
          <span>Country</span>
          <Select
            defaultValue='United States'
            options={countryOptions}
            aria-label={`${title} country`}
          />
        </label>
      </div>
    </section>
  );
}

function NewQuote() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<QuotePackage[]>(() => [createPackage()]);
  const [accessorialSearch, setAccessorialSearch] = useState("");
  const [selectedAccessorials, setSelectedAccessorials] = useState<string[]>([
    "Call Before Pickup",
  ]);

  const visibleAccessorials = useMemo(() => {
    const query = accessorialSearch.trim().toLowerCase();
    return query
      ? accessorialOptions.filter((option) => option.toLowerCase().includes(query))
      : accessorialOptions;
  }, [accessorialSearch]);

  const updateItem = (
    packageId: string,
    itemId: string,
    field: ItemField,
    value: string,
  ) => {
    setPackages((current) =>
      current.map((quotePackage) =>
        quotePackage.id === packageId
          ? {
              ...quotePackage,
              items: quotePackage.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
              ),
            }
          : quotePackage,
      ),
    );
  };

  const addItem = (packageId: string) => {
    setPackages((current) =>
      current.map((quotePackage) =>
        quotePackage.id === packageId
          ? { ...quotePackage, items: [...quotePackage.items, createItem()] }
          : quotePackage,
      ),
    );
  };

  const removeItem = (packageId: string, itemId: string) => {
    setPackages((current) => {
      const targetPackage = current.find((quotePackage) => quotePackage.id === packageId);
      if (!targetPackage) return current;

      if (targetPackage.items.length > 1) {
        return current.map((quotePackage) =>
          quotePackage.id === packageId
            ? {
                ...quotePackage,
                items: quotePackage.items.filter((item) => item.id !== itemId),
              }
            : quotePackage,
        );
      }

      if (current.length > 1) {
        return current.filter((quotePackage) => quotePackage.id !== packageId);
      }

      return current;
    });
  };

  const isOnlyItem = packages.length === 1 && packages[0].items.length === 1;

  return (
    <div className='new-quote-scroll'>
      <section className='new-quote-page'>
      <div className='new-quote-page__topline'>
        <button className='new-quote-back' type='button'>
          &larr; All Quotes
        </button>
        <div className='new-quote-page__top-actions'>
          <Button danger>Cancel Quote</Button>
          <Button>Save Quote</Button>
        </div>
      </div>

      <header className='new-quote-page__title'>
        <h1>New Quote: 60113985278</h1>
        <div>
          <span>Sales Group: <strong>Brian Young</strong></span>
          <i />
          <span>Sales Rep: <strong>Brian Young</strong></span>
          <i />
          <Select
            size='small'
            defaultValue='Notes: 2'
            options={[{ value: "Notes: 2", label: "Notes: 2" }]}
            aria-label='Quote notes count'
          />
        </div>
      </header>

      <div className='new-quote-layout'>
        <main className='new-quote-main'>
          <div className='new-quote-location-grid'>
            <QuoteLocationCard title='Pickup' zipLabel='Pickup Zip Code' includeDate />
            <QuoteLocationCard title='Destination' zipLabel='Dest. Zip Code' />
          </div>

          <div className='new-quote-packages'>
            {packages.map((quotePackage) => (
              <section className='new-quote-card quote-items-card' key={quotePackage.id}>
                <header className='new-quote-card__header quote-items-card__header'>
                  <h2>Items</h2>
                  <div className='quote-item-flags'>
                    <Button size='small' icon={<TeamOutlined />}>Inventory</Button>
                    <Checkbox>Stackable</Checkbox>
                    <Checkbox>Hazmat</Checkbox>
                    <Checkbox>Used</Checkbox>
                    <Checkbox>Machinery</Checkbox>
                  </div>
                </header>

                <div className='quote-items-table'>
                  <div className='quote-items-table__head' aria-hidden='true'>
                    <span>Units</span>
                    <span>Handling Unit</span>
                    <span>Pieces</span>
                    <span>Weight</span>
                    <span>Class</span>
                    <span>Dimensions</span>
                    <span>NMFC</span>
                    <span>Description</span>
                    <span />
                    <span />
                  </div>

                  {quotePackage.items.map((item) => (
                    <div className='quote-item-row' key={item.id}>
                      <Input
                        value={item.units}
                        aria-label='Units'
                        onChange={(event) => updateItem(quotePackage.id, item.id, "units", event.target.value)}
                      />
                      <Select
                        value={item.handlingUnit}
                        options={handlingUnitOptions}
                        aria-label='Handling unit'
                        onChange={(value) => updateItem(quotePackage.id, item.id, "handlingUnit", value)}
                      />
                      <Input
                        value={item.pieces}
                        aria-label='Pieces'
                        onChange={(event) => updateItem(quotePackage.id, item.id, "pieces", event.target.value)}
                      />
                      <div className='quote-item-combined quote-item-combined--weight'>
                        <Input
                          value={item.weight}
                          aria-label='Weight'
                          onChange={(event) => updateItem(quotePackage.id, item.id, "weight", event.target.value)}
                        />
                        <Select
                          value={item.weightUnit}
                          options={[{ value: "lbs", label: "lbs" }, { value: "kg", label: "kg" }]}
                          aria-label='Weight unit'
                          onChange={(value) => updateItem(quotePackage.id, item.id, "weightUnit", value)}
                        />
                      </div>
                      <Select
                        value={item.freightClass}
                        options={classOptions}
                        aria-label='Freight class'
                        onChange={(value) => updateItem(quotePackage.id, item.id, "freightClass", value)}
                      />
                      <div className='quote-item-combined quote-item-combined--dimensions'>
                        <Input
                          value={item.length}
                          placeholder='L'
                          aria-label='Length'
                          onChange={(event) => updateItem(quotePackage.id, item.id, "length", event.target.value)}
                        />
                        <Input
                          value={item.width}
                          placeholder='W'
                          aria-label='Width'
                          onChange={(event) => updateItem(quotePackage.id, item.id, "width", event.target.value)}
                        />
                        <Input
                          value={item.height}
                          placeholder='H'
                          aria-label='Height'
                          onChange={(event) => updateItem(quotePackage.id, item.id, "height", event.target.value)}
                        />
                        <Select
                          value={item.dimensionUnit}
                          options={[{ value: "in.", label: "in." }, { value: "cm", label: "cm" }]}
                          aria-label='Dimension unit'
                          onChange={(value) => updateItem(quotePackage.id, item.id, "dimensionUnit", value)}
                        />
                      </div>
                      <Input
                        value={item.nmfc}
                        placeholder='—'
                        aria-label='NMFC'
                        onChange={(event) => updateItem(quotePackage.id, item.id, "nmfc", event.target.value)}
                      />
                      <Input
                        value={item.description}
                        placeholder='Description'
                        aria-label='Description'
                        onChange={(event) => updateItem(quotePackage.id, item.id, "description", event.target.value)}
                      />
                      <Button
                        type='text'
                        className='quote-item-edit'
                        icon={<EditOutlined />}
                        aria-label='Edit item'
                        title='Edit item'
                      />
                      <Button
                        type='text'
                        danger
                        icon={<DeleteOutlined />}
                        disabled={isOnlyItem}
                        aria-label='Delete item'
                        title={isOnlyItem ? "At least one item is required" : "Delete item"}
                        onClick={() => removeItem(quotePackage.id, item.id)}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  className='quote-add-item'
                  size='small'
                  icon={<PlusOutlined />}
                  onClick={() => addItem(quotePackage.id)}>
                  Add Item
                </Button>
              </section>
            ))}
          </div>

          <div className='new-quote-lower-grid'>
            <section className='new-quote-card quote-customer-card'>
              <header className='new-quote-card__header'>
                <h2>Customer Information</h2>
              </header>
              <div className='quote-customer-card__body'>
                <Select
                  defaultValue='Inland Transport Buy Rates'
                  options={[{ value: "Inland Transport Buy Rates", label: "Inland Transport Buy Rates" }]}
                  aria-label='Customer rate source'
                />
                <Input placeholder='Carrier' aria-label='Carrier' />
                <label className='new-quote-field'>
                  <span>Get Top:</span>
                  <Input defaultValue='10' aria-label='Get top rates' />
                </label>
                <div className='quote-charge-row'>
                  <Input placeholder='Charge Type' aria-label='Charge type' />
                  <Input placeholder='Amount' aria-label='Charge amount' />
                </div>
                <div className='quote-charge-actions'>
                  <Button className='quote-charge-add'>Add</Button>
                  <Button danger>Remove</Button>
                </div>
              </div>
            </section>

            <div className='new-quote-rate-actions'>
              <Button icon={<PlusOutlined />} onClick={() => setPackages((current) => [...current, createPackage()])}>
                Add Package
              </Button>
              <Button type='primary' onClick={() => navigate("/quotes/rate")}>
                See Rates
              </Button>
            </div>
          </div>
        </main>

        <aside className='new-quote-aside'>
          <section className='new-quote-card quote-accessorial-card'>
            <header className='new-quote-card__header'>
              <h2>Accessorials</h2>
            </header>
            <Input
              className='quote-accessorial-search'
              value={accessorialSearch}
              placeholder='Search accessorials...'
              allowClear
              onChange={(event) => setAccessorialSearch(event.target.value)}
            />
            <div className='quote-accessorial-list'>
              {visibleAccessorials.map((option) => {
                const checked = selectedAccessorials.includes(option);
                return (
                  <label className={checked ? "is-checked" : ""} key={option}>
                    <Checkbox
                      checked={checked}
                      onChange={(event) =>
                        setSelectedAccessorials((current) =>
                          event.target.checked
                            ? [...current, option]
                            : current.filter((value) => value !== option),
                        )
                      }>
                      {option}
                    </Checkbox>
                  </label>
                );
              })}
            </div>
          </section>

          <section className='new-quote-card quote-notes-card'>
            <header className='new-quote-card__header'>
              <h2>Notes</h2>
              <Button size='small' icon={<PlusOutlined />}>Add Note</Button>
            </header>
            <ol className='quote-notes-list'>
              <li>Make sure customer rep is at gate to supervise unloading.</li>
            </ol>
            <div className='quote-note-entry'>
              <Input.TextArea placeholder='Add a note...' rows={3} />
              <Button className='quote-note-confirm'>Confirm</Button>
            </div>
          </section>
        </aside>
      </div>
      </section>
    </div>
  );
}

export default NewQuote;
