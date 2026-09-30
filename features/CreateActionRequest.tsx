import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { FeatureParams, SContainer, SInput, SSelect, stringifyResponse } from '../utils';

function CreateActionRequest({ authenticatedData, setOperationOutput, setError, isPublicAPI }: FeatureParams) {
  const [bankAccountId, setBankAccountId] = useState('');
  const [bankTransferRecipientId, setBankTransferRecipientId] = useState('');
  const [market, setMarket] = useState<'NL' | 'FR'>('NL');
  const [recipientIban, setRecipientIban] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientBic, setRecipientBic] = useState('');
  const [userLabel, setUserLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createActionRequest = useCallback(async () => {
    const numericAmount = Number(amount);
    const missingNlRecipient =
      market === 'NL' &&
      (!recipientIban.trim() || !recipientName.trim() || !recipientBic.trim() || !userLabel.trim());
    const missingFrRecipient = market === 'FR' && !bankTransferRecipientId.trim();
    if (!bankAccountId.trim() || missingNlRecipient || missingFrRecipient || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError(
        market === 'NL'
          ? 'Enter a bank account ID, recipient IBAN, recipient name, BIC, user label, and a positive amount.'
          : 'Enter a bank account ID, recipient ID, and a positive amount.',
      );
      return;
    }

    const { uid } = authenticatedData;
    setError(null);
    setOperationOutput(null);
    setIsSubmitting(true);
    try {
      const result = await axios.post('/create-action-request', {
        uid,
        amount: numericAmount,
        bankAccountId: bankAccountId.trim(),
        companyUserId: authenticatedData.companyUserId,
        access_token: authenticatedData.access_token,
        ...(market === 'NL'
          ? {
              recipient: {
                iban: recipientIban.trim(),
                name: recipientName.trim(),
                bic: recipientBic.trim(),
              },
              userLabel: userLabel.trim(),
            }
          : { bankTransferRecipientId: bankTransferRecipientId.trim() }),
      });
      setOperationOutput(stringifyResponse(result.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(stringifyResponse(error.response?.data ?? { message: error.message }));
      } else {
        setError(error instanceof Error ? error.message : 'Failed to create bank transfer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    setError,
    setOperationOutput,
    bankAccountId,
    authenticatedData,
    bankTransferRecipientId,
    amount,
    market,
    recipientIban,
    recipientName,
    recipientBic,
    userLabel,
  ]);

  return (
    <SContainer>
      {isPublicAPI && (
        <p>
          Bank transfer creation requires the regulated mTLS API. Set PSD2_REGULATION to true and configure your
          staging QWAC/QSEAL credentials before submitting.
        </p>
      )}
      <SSelect
        value={market}
        onChange={(event) => setMarket(event.target.value as 'NL' | 'FR')}
        aria-label="Bank account market"
      >
        <option value="NL">Netherlands (inline SEPA recipient)</option>
        <option value="FR">France (saved recipient)</option>
      </SSelect>
      <SInput
        value={bankAccountId}
        onChange={(e) => setBankAccountId(e.target.value)}
        type="text"
        placeholder="Bank account id"
        aria-label="Bank account ID"
        size={40}
      />
      {market === 'NL' ? (
        <>
          <SInput
            value={recipientIban}
            onChange={(event) => setRecipientIban(event.target.value)}
            type="text"
            placeholder="Recipient IBAN (NL)"
            aria-label="Recipient IBAN"
            size={40}
          />
          <SInput
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
            type="text"
            placeholder="Recipient name"
            aria-label="Recipient name"
            size={40}
          />
          <SInput
            value={recipientBic}
            onChange={(event) => setRecipientBic(event.target.value)}
            type="text"
            placeholder="Recipient BIC"
            aria-label="Recipient BIC"
            size={40}
          />
          <SInput
            value={userLabel}
            onChange={(event) => setUserLabel(event.target.value)}
            type="text"
            placeholder="Payment reference / user label"
            aria-label="Payment reference"
            size={40}
          />
        </>
      ) : (
        <SInput
          value={bankTransferRecipientId}
          onChange={(event) => setBankTransferRecipientId(event.target.value)}
          type="text"
          placeholder="Bank transfer recipient ID"
          aria-label="Bank transfer recipient ID"
          size={40}
        />
      )}
      <SInput
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Amount"
        aria-label="Amount"
        size={40}
      />

      <Button
        key="createBankTransfer"
        text={isSubmitting ? 'Waiting for transfer confirmation...' : 'Create Bank Transfer'}
        onClick={createActionRequest}
        disabled={isSubmitting || isPublicAPI}
      />
      {isSubmitting && <p>Approve the action request in Shine. This page will update when it completes.</p>}
    </SContainer>
  );
}

export default CreateActionRequest;
