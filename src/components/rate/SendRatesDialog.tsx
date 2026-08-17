import {
  CloseOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Input, Modal } from "antd";

export type SendRateItem = {
  id: string;
  name: string;
  code: string;
  service: string;
  price: number;
  transitDays: number;
  estimatedDelivery: string;
  logo?: string;
  logoKind: "image" | "fedex";
};

type SendRatesDialogProps = {
  open: boolean;
  rates: SendRateItem[];
  recipients: string[];
  selectedRateIds: string[];
  validationError: string;
  onClose: () => void;
  onRecipientsChange: (recipients: string[]) => void;
  onSelectedRateIdsChange: (rateIds: string[]) => void;
  onSubmit: () => void;
};

function DialogCarrierLogo({ rate }: { rate: SendRateItem }) {
  if (rate.logoKind === "fedex") {
    return (
      <span className='rate-fedex-logo' aria-label='FedEx Freight'>
        <span>Fed</span>
        <strong>Ex</strong>
      </span>
    );
  }

  return <img src={rate.logo} alt={`${rate.name} logo`} />;
}

export default function SendRatesDialog({
  open,
  rates,
  recipients,
  selectedRateIds,
  validationError,
  onClose,
  onRecipientsChange,
  onSelectedRateIdsChange,
  onSubmit,
}: SendRatesDialogProps) {
  const allRatesSelected = rates.every((rate) =>
    selectedRateIds.includes(rate.id),
  );

  const updateRecipient = (index: number, email: string) => {
    onRecipientsChange(
      recipients.map((recipient, recipientIndex) =>
        recipientIndex === index ? email : recipient,
      ),
    );
  };

  const removeRecipient = (index: number) => {
    onRecipientsChange(
      recipients.filter((_, recipientIndex) => recipientIndex !== index),
    );
  };

  const toggleRate = (rateId: string, checked: boolean) => {
    onSelectedRateIdsChange(
      checked
        ? Array.from(new Set([...selectedRateIds, rateId]))
        : selectedRateIds.filter((id) => id !== rateId),
    );
  };

  const toggleAllRates = () => {
    onSelectedRateIdsChange(
      allRatesSelected ? [] : rates.map((rate) => rate.id),
    );
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width={580}
      className='send-rates-modal'
      onCancel={onClose}>
      <form
        className='send-rates-dialog'
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}>
        <header className='send-rates-dialog__header'>
          <div>
            <h2>Send freight rates</h2>
            <p>Quote #60113985278 {"\u00b7"} Chandler, AZ {"\u2192"} Southington, CT</p>
          </div>
          <button
            type='button'
            className='send-rates-dialog__close'
            aria-label='Close send rates dialog'
            onClick={onClose}>
            <CloseOutlined />
          </button>
        </header>

        <section
          className='send-rates-dialog__recipients'
          aria-labelledby='send-to-title'>
          <h3 id='send-to-title'>Send to</h3>
          <div className='send-rates-dialog__recipient-list'>
            {recipients.map((recipient, index) => (
              <div
                className='send-rates-dialog__recipient'
                key={`recipient-${index}`}>
                <Input
                  type='email'
                  value={recipient}
                  placeholder='Email address'
                  aria-label={`Recipient email ${index + 1}`}
                  onChange={(event) => updateRecipient(index, event.target.value)}
                />
                <button
                  type='button'
                  className='send-rates-dialog__remove-recipient'
                  aria-label={`Remove recipient ${index + 1}`}
                  onClick={() => removeRecipient(index)}>
                  <CloseOutlined />
                </button>
              </div>
            ))}
          </div>
          <Button
            htmlType='button'
            className='send-rates-dialog__add-recipient'
            icon={<PlusOutlined />}
            onClick={() => onRecipientsChange([...recipients, ""])}>
            Add recipient
          </Button>
        </section>

        <section
          className='send-rates-dialog__rates'
          aria-labelledby='rates-to-include-title'>
          <div className='send-rates-dialog__rates-heading'>
            <h3 id='rates-to-include-title'>Rates to include</h3>
            <div>
              <span>{selectedRateIds.length} selected</span>
              <button type='button' onClick={toggleAllRates}>
                {allRatesSelected ? "Clear all" : "Select all"}
              </button>
            </div>
          </div>

          <div className='send-rates-dialog__rate-list'>
            {rates.map((rate) => {
              const checked = selectedRateIds.includes(rate.id);
              const serviceLabel =
                rate.service === "STANDARD RATE" ? "Standard" : "Economy";

              return (
                <label
                  className={`send-rates-dialog__rate ${checked ? "is-selected" : ""}`}
                  key={rate.id}>
                  <Checkbox
                    checked={checked}
                    onChange={(event) => toggleRate(rate.id, event.target.checked)}
                    aria-label={`Include ${rate.name}`}
                  />
                  <span className='send-rates-dialog__logo'>
                    <DialogCarrierLogo rate={rate} />
                  </span>
                  <span className='send-rates-dialog__rate-details'>
                    <span className='send-rates-dialog__rate-name'>
                      {rate.name}
                      <small>{rate.code}</small>
                    </span>
                    <span className='send-rates-dialog__rate-meta'>
                      {rate.transitDays} days <b>{"\u00b7"}</b> Est. delivery{" "}
                      {rate.estimatedDelivery}
                      <em
                        className={
                          rate.service === "ECONOMY" ? "is-economy" : ""
                        }>
                        {serviceLabel}
                      </em>
                    </span>
                  </span>
                  <span className='send-rates-dialog__price'>
                    {rate.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                    <small>Net + FSC</small>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {validationError ? (
          <p className='send-rates-dialog__validation' role='alert'>
            {validationError}
          </p>
        ) : null}

        <footer className='send-rates-dialog__footer'>
          <p>
            <strong>{selectedRateIds.length}</strong> rates {"\u00b7"}{" "}
            <strong>{recipients.length}</strong>{" "}
            {recipients.length === 1 ? "recipient" : "recipients"}
          </p>
          <div>
            <Button htmlType='button' onClick={onClose}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' icon={<SendOutlined />}>
              Send rates
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
