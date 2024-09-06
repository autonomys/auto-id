export const AutoScore = ({ score }: { score: number }) => <div className="relative w-16 h-16">
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
        />
        <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#929EEA"
            strokeWidth="10"
            strokeDasharray={`${score * 2.83} 283`}
            transform="rotate(-90 50 50)"
        />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{score}</span>
    </div>
</div>