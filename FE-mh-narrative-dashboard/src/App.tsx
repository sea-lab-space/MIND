import { useState } from 'react'
import './App.css'
import InsightCardComponent from "@/components/InsightCardComponent"

function App() {
    const [selectedCards, setSelectedCards] = useState<number[]>([0])
    const [isExpanded, setIsExpanded] = useState<boolean>(true) // shared state for all cards

    const handleCardSelect = (index: number) => {
        setSelectedCards((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        )
    }

    const handleToggleAll = () => {
        setIsExpanded((prev) => !prev)
    }

    const handleSelectAll = () => {
        setSelectedCards(selectedCards.length === cardData.length ? [] : [0, 1, 2])
    }

    const cardData = [
        {
            title: "Increased social activity, yet remains in a closed circle",
            sources: [
                { type: "passive-sensing" as const },
                { type: "clinical-notes" as const },
                { type: "patient-data" as const },
            ],
        },
        {
            title: "Growing Activity Level Despite Persistent Fatigue",
            sources: [{ type: "passive-sensing" as const }, { type: "clinical-notes" as const }],
        },
        {
            title: "Enhanced Cognitive Function and Focus",
            sources: [
                { type: "patient-data" as const },
                { type: "passive-sensing" as const },
                { type: "clinical-notes" as const },
            ],
        },
    ]

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">

            {/* Grid with 6 columns for layout */}
            <div className="grid grid-cols-6 gap-6">
                {cardData.map((card, index) => {
                    const colSpan = isExpanded ? "col-span-3" : "col-span-2"

                    return (
                        <div key={index} className={`${colSpan}`}>
                            <InsightCardComponent
                                title={card.title}
                                sources={card.sources}
                                isExpanded={isExpanded}
                                isSelected={selectedCards.includes(index)}
                                onSelect={() => handleCardSelect(index)}
                                onToggle={handleToggleAll} // toggles global state
                            />
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default App
