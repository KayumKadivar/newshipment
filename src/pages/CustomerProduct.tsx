import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  cloneCustomerProductSeed,
  type CustomerProduct,
} from "./customerProductData";

type ProductFormValues = Omit<CustomerProduct, "key">;
type ProductView = "detail" | "group";

interface CustomerProductPageProps {
  products: CustomerProduct[];
  setProducts: Dispatch<SetStateAction<CustomerProduct[]>>;
}

interface ProductGroupSummary {
  key: string;
  productGroup: string;
  total: number;
  active: number;
  inactive: number;
  hazmat: number;
  nonHazmat: number;
}

const CSV_COLUMNS: Array<{
  header: string;
  key: keyof Omit<CustomerProduct, "key">;
}> = [
  { header: "Description", key: "description" },
  { header: "Active", key: "isActive" },
  { header: "NMFC", key: "nmfc" },
  { header: "Product Class", key: "productClass" },
  { header: "Commodity", key: "commodity" },
  { header: "Hazmat", key: "isHazmat" },
  { header: "Hazmat Contact", key: "hazmatContact" },
  { header: "Length", key: "length" },
  { header: "Height", key: "height" },
  { header: "Weight", key: "weight" },
  { header: "Width", key: "width" },
  { header: "Product Group", key: "productGroup" },
];

const requiredCsvHeaders = [
  "Description",
  "NMFC",
  "Product Class",
  "Length",
  "Height",
  "Weight",
  "Width",
  "Product Group",
  "Hazmat",
];

const emptyText = (value: string) =>
  value || <span className='product-empty'>—</span>;

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function parseBoolean(value: string): boolean | null {
  const normalised = value.trim().toLowerCase();
  if (["yes", "true", "1", "active", "hazmat"].includes(normalised)) return true;
  if (["no", "false", "0", "inactive", "non-hazmat", "non hazmat"].includes(normalised)) return false;
  return null;
}

function CustomerProductPage({
  products,
  setProducts,
}: CustomerProductPageProps) {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeView, setActiveView] = useState<ProductView>("detail");
  const [editingProduct, setEditingProduct] =
    useState<CustomerProduct | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form] = Form.useForm<ProductFormValues>();
  const isHazmat = Form.useWatch("isHazmat", form);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageApi, messageContext] = message.useMessage();
  const [modalApi, modalContext] = Modal.useModal();

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;

    return products.filter((product) =>
      [
        product.description,
        product.nmfc,
        product.productClass,
        product.commodity,
        product.hazmatContact,
        product.productGroup,
      ].some((value) => value.toLowerCase().includes(needle)),
    );
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const visibleProducts = filteredProducts.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const groupSummaries = useMemo<ProductGroupSummary[]>(() => {
    const groups = new Map<string, ProductGroupSummary>();
    filteredProducts.forEach((product) => {
      const group = product.productGroup || "UNGROUPED";
      const summary = groups.get(group) ?? {
        key: group,
        productGroup: group,
        total: 0,
        active: 0,
        inactive: 0,
        hazmat: 0,
        nonHazmat: 0,
      };
      summary.total += 1;
      summary.active += product.isActive ? 1 : 0;
      summary.inactive += product.isActive ? 0 : 1;
      summary.hazmat += product.isHazmat ? 1 : 0;
      summary.nonHazmat += product.isHazmat ? 0 : 1;
      groups.set(group, summary);
    });
    return [...groups.values()].sort((first, second) =>
      first.productGroup.localeCompare(second.productGroup),
    );
  }, [filteredProducts]);

  const selectedVisibleCount = visibleProducts.filter((product) =>
    selectedKeys.has(product.key),
  ).length;
  const allVisibleSelected =
    visibleProducts.length > 0 && selectedVisibleCount === visibleProducts.length;

  const toggleVisibleProducts = (checked: boolean) => {
    setSelectedKeys((current) => {
      const next = new Set(current);
      visibleProducts.forEach((product) => {
        if (checked) next.add(product.key);
        else next.delete(product.key);
      });
      return next;
    });
  };

  const toggleProduct = (key: string, checked: boolean) => {
    setSelectedKeys((current) => {
      const next = new Set(current);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const openAddForm = () => {
    navigate("/customer-products/add");
  };

  const openEditForm = (product: CustomerProduct) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const saveProduct = async () => {
    const values = await form.validateFields();
    if (!editingProduct) return;

    setProducts((current) =>
      current.map((product) =>
        product.key === editingProduct.key ? { ...product, ...values } : product,
      ),
    );
    messageApi.success("Product updated");
    closeForm();
  };

  const confirmDelete = () => {
    if (!selectedKeys.size) return;
    modalApi.confirm({
      title: "Delete selected products?",
      content: `${selectedKeys.size} product${selectedKeys.size === 1 ? "" : "s"} will be removed from this demo.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        setProducts((current) =>
          current.filter((product) => !selectedKeys.has(product.key)),
        );
        setSelectedKeys(new Set());
        messageApi.success("Selected products deleted");
      },
    });
  };

  const refreshProducts = () => {
    setProducts(cloneCustomerProductSeed());
    setSelectedKeys(new Set());
    setQuery("");
    setCurrentPage(1);
    setPageSize(10);
    messageApi.success("Products refreshed");
  };

  const downloadCsv = () => {
    const rows = products.map((product) =>
      CSV_COLUMNS.map(({ key }) =>
        escapeCsv(
          key === "isActive" || key === "isHazmat"
            ? product[key]
              ? "Yes"
              : "No"
            : product[key],
        ),
      ).join(","),
    );
    const csv = [
      CSV_COLUMNS.map(({ header }) => escapeCsv(header)).join(","),
      ...rows,
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "customer-products.csv";
    link.click();
    URL.revokeObjectURL(url);
    messageApi.success(`Downloaded ${products.length} products`);
  };

  const uploadCsv = async (file: File) => {
    try {
      const rows = parseCsv(await file.text());
      if (rows.length < 2) throw new Error("The CSV does not contain any product rows.");

      const headers = rows[0].map((header, index) =>
        index === 0 ? header.trim().replace(/^\uFEFF/, "") : header.trim(),
      );
      const missingHeaders = requiredCsvHeaders.filter(
        (header) => !headers.includes(header),
      );
      if (missingHeaders.length) {
        throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`);
      }

      const headerIndexes = Object.fromEntries(
        CSV_COLUMNS.map(({ header }) => [header, headers.indexOf(header)]),
      ) as Record<string, number>;
      const getValue = (row: string[], header: string) => {
        const index = headerIndexes[header];
        return index >= 0 ? row[index]?.trim() ?? "" : "";
      };
      const numericFields = ["Length", "Height", "Weight", "Width"] as const;

      const uploadedProducts = rows.slice(1).map((row, rowIndex) => {
        const description = getValue(row, "Description");
        const nmfc = getValue(row, "NMFC");
        const productClass = getValue(row, "Product Class");
        const productGroup = getValue(row, "Product Group");
        const hazmatValue = parseBoolean(getValue(row, "Hazmat"));
        const numericValues = Object.fromEntries(
          numericFields.map((field) => [field, Number(getValue(row, field))]),
        ) as Record<(typeof numericFields)[number], number>;

        if (!description || !nmfc || !productClass || !productGroup) {
          throw new Error(`Row ${rowIndex + 2} is missing a required product value.`);
        }
        if (hazmatValue === null) {
          throw new Error(`Row ${rowIndex + 2} has an invalid Hazmat value.`);
        }
        if (
          numericFields.some(
            (field) =>
              !getValue(row, field) || !Number.isFinite(numericValues[field]),
          )
        ) {
          throw new Error(`Row ${rowIndex + 2} has an invalid dimension or weight.`);
        }

        return {
          key: `upload-product-${Date.now()}-${rowIndex}`,
          description,
          isActive: parseBoolean(getValue(row, "Active")) ?? true,
          nmfc,
          productClass,
          commodity: getValue(row, "Commodity"),
          isHazmat: hazmatValue,
          hazmatContact: getValue(row, "Hazmat Contact"),
          length: numericValues.Length,
          height: numericValues.Height,
          weight: numericValues.Weight,
          width: numericValues.Width,
          productGroup,
        } satisfies CustomerProduct;
      });

      setProducts((current) => [...current, ...uploadedProducts]);
      setCurrentPage(1);
      messageApi.success(`Uploaded ${uploadedProducts.length} products`);
    } catch (error) {
      messageApi.error(
        error instanceof Error ? error.message : "Unable to read this CSV file.",
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const columns: ColumnsType<CustomerProduct> = [
    {
      title: (
        <Checkbox
          checked={allVisibleSelected}
          indeterminate={
            selectedVisibleCount > 0 && selectedVisibleCount < visibleProducts.length
          }
          disabled={!visibleProducts.length}
          aria-label='Select all visible customer products'
          onChange={(event) => toggleVisibleProducts(event.target.checked)}
        />
      ),
      width: 38,
      fixed: "left",
      render: (_, product) => (
        <Checkbox
          checked={selectedKeys.has(product.key)}
          aria-label={`Select ${product.description}`}
          onChange={(event) => toggleProduct(product.key, event.target.checked)}
        />
      ),
    },
    {
      title: "",
      width: 38,
      fixed: "left",
      render: (_, product) => (
        <Button
          type='text'
          className='product-edit-button'
          aria-label={`Edit ${product.description}`}
          icon={<EditOutlined />}
          onClick={() => openEditForm(product)}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 205,
      fixed: "left",
      render: (value: string) => <strong className='product-description-cell'>{value}</strong>,
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      width: 90,
      align: "center",
      render: (isActive: boolean) => (
        <span
          className={`product-active-dot${isActive ? "" : " product-active-dot--off"}`}
          aria-label={isActive ? "Active" : "Inactive"}
          title={isActive ? "Active" : "Inactive"}
        />
      ),
    },
    { title: "NMFC", dataIndex: "nmfc", width: 104 },
    { title: "Product Class", dataIndex: "productClass", width: 170, render: emptyText },
    { title: "Commodity", dataIndex: "commodity", width: 190, render: emptyText },
    {
      title: "Hazmat",
      dataIndex: "isHazmat",
      width: 92,
      align: "center",
      render: (isHazmat: boolean) => (isHazmat ? "Yes" : <span className='product-empty'>—</span>),
    },
    { title: "Hazmat Contact", dataIndex: "hazmatContact", width: 160, render: emptyText },
    { title: "Length", dataIndex: "length", width: 94, align: "right" },
    { title: "Height", dataIndex: "height", width: 94, align: "right" },
    { title: "Weight", dataIndex: "weight", width: 102, align: "right" },
    { title: "Width", dataIndex: "width", width: 94, align: "right" },
    {
      title: "Product Group",
      dataIndex: "productGroup",
      width: 146,
      render: (productGroup: string) => (
        <Tag className='product-group-tag'>{productGroup}</Tag>
      ),
    },
  ];

  const groupColumns: ColumnsType<ProductGroupSummary> = [
    {
      title: "Product Group",
      dataIndex: "productGroup",
      render: (value: string) => <strong className='product-description-cell'>{value}</strong>,
    },
    { title: "Products", dataIndex: "total", width: 120, align: "center" },
    { title: "Active", dataIndex: "active", width: 110, align: "center" },
    { title: "Inactive", dataIndex: "inactive", width: 110, align: "center" },
    { title: "Hazmat", dataIndex: "hazmat", width: 110, align: "center" },
    { title: "Non-Hazmat", dataIndex: "nonHazmat", width: 140, align: "center" },
  ];

  const shownStart = filteredProducts.length ? pageStart + 1 : 0;
  const shownEnd = Math.min(pageStart + pageSize, filteredProducts.length);

  return (
    <section className='customer-products-page'>
      {messageContext}
      {modalContext}
      <input
        ref={fileInputRef}
        className='product-file-input'
        type='file'
        accept='.csv,text/csv'
        aria-label='Upload customer products CSV'
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadCsv(file);
        }}
      />

      <div className='customer-products-heading'>
        <div>
          <Typography.Title level={1}>Products</Typography.Title>
          <Typography.Text>Manage address book entries for all clients</Typography.Text>
        </div>
        <div className='customer-product-actions'>
          <Button icon={<DownloadOutlined />} onClick={downloadCsv}>
            Download Products
          </Button>
          <Button
            className='product-upload-button'
            icon={<UploadOutlined />}
            onClick={() => fileInputRef.current?.click()}>
            Upload Products
          </Button>
          <Button type='primary' icon={<PlusOutlined />} onClick={openAddForm}>
            Add Products
          </Button>
        </div>
      </div>

      <Tabs
        className='customer-product-tabs'
        activeKey={activeView}
        animated={{ inkBar: true, tabPane: false }}
        aria-label='Customer product views'
        items={[
          { key: "detail", label: "Product Details" },
          { key: "group", label: "Product Group" },
        ]}
        onChange={(key) => setActiveView(key as ProductView)}
      />

      <div className='customer-product-controls'>
        <div className='product-client-row'>
          <span>Client:</span>
          <Button icon={<UserOutlined />}>INLAND TRANSPORT, INC.</Button>
        </div>
        <div className='product-toolbar'>
          <div className='product-toolbar__left'>
            <Input
              allowClear
              value={query}
              prefix={<SearchOutlined />}
              placeholder={activeView === "detail" ? "Search products..." : "Search groups or products..."}
              aria-label='Search customer products'
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
            />
            <Button icon={<ReloadOutlined />} onClick={refreshProducts}>
              Refresh
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={!selectedKeys.size || activeView !== "detail"}
              onClick={confirmDelete}>
              Delete{selectedKeys.size ? ` (${selectedKeys.size})` : ""}
            </Button>
          </div>

          {activeView === "detail" ? (
            <div className='product-page-controls'>
              <span>Page size</span>
              <Select
                value={pageSize}
                aria-label='Customer products page size'
                options={[10, 20, 50].map((value) => ({ value, label: value }))}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
              />
              <Button
                aria-label='Previous page'
                icon={<LeftOutlined />}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              />
              <span>{currentPage} of {totalPages}</span>
              <Button
                aria-label='Next page'
                icon={<RightOutlined />}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className='customer-product-table-card'>
        {activeView === "detail" ? (
          <>
            <Table<CustomerProduct>
              columns={columns}
              dataSource={visibleProducts}
              pagination={false}
              scroll={{ x: 1770 }}
              locale={{ emptyText: query ? "No products match your search" : "No customer products" }}
              rowClassName={(product) =>
                selectedKeys.has(product.key) ? "product-row-selected" : ""
              }
            />
            <div className='customer-product-footer'>
              <span>
                Showing {shownStart}-{shownEnd} of <strong>{filteredProducts.length}</strong>{" "}
                Products
              </span>
              <div className='customer-product-pagination'>
                <button
                  type='button'
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    type='button'
                    key={page}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={page === currentPage ? "current" : ""}
                    onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                ))}
                <button
                  type='button'
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <Table<ProductGroupSummary>
            className='customer-product-group-table'
            columns={groupColumns}
            dataSource={groupSummaries}
            pagination={false}
            scroll={{ x: 760 }}
            locale={{ emptyText: query ? "No groups match your search" : "No product groups" }}
          />
        )}
      </div>

      <Modal
        title='Edit Product'
        open={isFormOpen}
        okText='Save Changes'
        width={780}
        onCancel={closeForm}
        onOk={() => void saveProduct()}>
        <Form<ProductFormValues>
          form={form}
          layout='vertical'
          className='customer-product-form'>
          <div className='customer-product-form-grid'>
            <Form.Item
              label='Description'
              name='description'
              rules={[{ required: true, message: "Enter a product description" }]}>
              <Input />
            </Form.Item>
            <Form.Item label='Active' name='isActive' valuePropName='checked'>
              <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
            </Form.Item>
            <Form.Item label='NMFC' name='nmfc'>
              <Input />
            </Form.Item>
            <Form.Item label='Product class' name='productClass'>
              <Input />
            </Form.Item>
            <Form.Item label='Commodity' name='commodity'>
              <Input />
            </Form.Item>
            <Form.Item label='Hazmat' name='isHazmat' valuePropName='checked'>
              <Switch checkedChildren='Yes' unCheckedChildren='No' />
            </Form.Item>
            {isHazmat ? (
              <Form.Item
                label='Hazmat contact'
                name='hazmatContact'
                rules={[{ required: true, message: "Enter a hazmat contact" }]}>
                <Input />
              </Form.Item>
            ) : null}
            <Form.Item label='Length' name='length'>
              <InputNumber min={0} precision={0} />
            </Form.Item>
            <Form.Item label='Height' name='height'>
              <InputNumber min={0} precision={0} />
            </Form.Item>
            <Form.Item label='Weight' name='weight'>
              <InputNumber min={0} precision={0} />
            </Form.Item>
            <Form.Item label='Width' name='width'>
              <InputNumber min={0} precision={0} />
            </Form.Item>
            <Form.Item
              label='Product group'
              name='productGroup'
              rules={[{ required: true, message: "Enter a product group" }]}>
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </section>
  );
}

export default CustomerProductPage;
