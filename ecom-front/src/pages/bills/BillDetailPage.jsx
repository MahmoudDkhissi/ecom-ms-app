import { useParams, useNavigate } from 'react-router-dom'
import { useBill } from '../../hooks/useBills'

export default function BillDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: bill, isLoading, isError } = useBill(id)

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-gray-400 text-sm">Chargement...</span>
            </div>
        )
    }

    if (isError || !bill) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-red-500 text-sm">Facture introuvable.</span>
            </div>
        )
    }

    const productItems = bill.productItems ?? []

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/bills')}
                className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
            >
                ← Retour aux factures
            </button>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-medium text-gray-900">
                                Facture #{bill.id}
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {bill.name ?? bill.description ?? '—'}
                            </p>
                        </div>
                        <StatusBadge status={bill.status} />
                    </div>
                </div>

                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Client</p>
                    <p className="text-sm font-medium text-gray-900">
                        {bill.customer?.name ?? `ID: ${bill.customerId}`}
                    </p>
                    {bill.customer?.email && (
                        <p className="text-xs text-gray-400">{bill.customer.email}</p>
                    )}
                </div>

                <div className="px-5 py-4">
                    <p className="text-xs text-gray-400 mb-3">Produits commandés</p>
                    {productItems.length === 0 ? (
                        <p className="text-sm text-gray-400">Aucun produit.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {productItems.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            {item.product?.name ?? `Produit #${item.productId}`}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {item.product?.price?.toFixed(2)} € × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {item.product?.price != null
                                            ? (item.product.price * item.quantity).toFixed(2) + ' €'
                                            : '—'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {bill.totalAmount != null && (
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-lg font-medium text-gray-900">
              {bill.totalAmount.toFixed(2)} €
            </span>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }) {
    const styles = {
        PENDING:   'bg-amber-50 text-amber-700 border-amber-200',
        PAID:      'bg-green-50 text-green-700 border-green-200',
        CANCELLED: 'bg-red-50 text-red-600 border-red-200',
    }
    const labels = {
        PENDING:   'En attente',
        PAID:      'Payée',
        CANCELLED: 'Annulée',
    }
    if (!status) return null
    return (
        <span className={`text-xs border px-2 py-0.5 rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {labels[status] ?? status}
    </span>
    )
}