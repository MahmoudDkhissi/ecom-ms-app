import { useNavigate } from 'react-router-dom'
import { useBills } from '../../hooks/useBills'
import { deleteBill } from '../../api/billService'
import { useQueryClient } from '@tanstack/react-query'

export default function BillsPage() {
    const { data, isLoading, isError } = useBills()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!confirm('Supprimer cette facture ?')) return
        try {
            await deleteBill(id)
            queryClient.invalidateQueries(['bills'])
        } catch {
            alert('Erreur lors de la suppression.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-gray-400 text-sm">Chargement des factures...</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-64">
        <span className="text-red-500 text-sm">
          Impossible de charger les factures.
        </span>
            </div>
        )
    }

    const bills = data?._embedded?.bills ?? data ?? []

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-medium text-gray-900">Factures</h1>
                <span className="text-sm text-gray-400">{bills.length} facture(s)</span>
            </div>

            {bills.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <p className="text-gray-400 text-sm">Aucune facture pour le moment.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Aller au catalogue
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {bills.map((bill, index) => (
                        <div
                            key={bill.id}
                            onClick={() => navigate(`/bills/${bill.id}`)}
                            className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                index !== bills.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900">
                                        Facture #{bill.id}
                                    </p>
                                    <StatusBadge status={bill.status} />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                    {bill.name ?? bill.description ?? '—'}
                                </p>
                            </div>

                            <div className="text-sm font-medium text-gray-900">
                                {bill.totalAmount != null
                                    ? `${bill.totalAmount.toFixed(2)} €`
                                    : '—'}
                            </div>

                            <button
                                onClick={(e) => handleDelete(e, bill.id)}
                                className="text-gray-300 hover:text-red-400 text-lg leading-none ml-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
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