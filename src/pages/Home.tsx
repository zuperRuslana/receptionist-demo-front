import AgentCard from '../components/AgentCard'
import ResolutionChart from '../components/ResolutionChart'
import StatsGrid from '../components/StatsGrid'
import KnowledgeBase from './KnowledgeBase'
import ChatModal from '../components/ChatModal'

interface HomeProps {
  modalOpen: boolean
  onOpenModal: () => void
  onCloseModal: () => void
}

const Home = ({ modalOpen, onCloseModal }: HomeProps) => (
  <div className="p-5 grid grid-cols-[300px_1fr] gap-4 items-start">

    {/* ── Left column ── */}
    <div className="flex flex-col gap-[14px]">
      <div className="animate-fadeUp" style={{ animationDelay: '0ms' }}>
        <AgentCard />
      </div>
      <div className="animate-fadeUp" style={{ animationDelay: '80ms' }}>
        <ResolutionChart />
      </div>
      <div
        className="animate-fadeUp bg-[#FAF8F3] rounded-[14px] p-4"
        style={{ animationDelay: '160ms', border: '0.5px solid #CCC9C0' }}
      >
        <div className="font-mono text-[9px] text-[#999] tracking-[1.2px] mb-2">
          LOGIC ARCHITECTURE
        </div>
        <p className="text-xs text-[#5C5C58] leading-[1.65] mb-2.5">
          Trained on Glow Beauty Clinic's full service catalog, pricing, booking flow, and
          promotional rules. Optimized for sales conversion and client satisfaction.
        </p>
        <span className="font-mono text-[10px] text-[#B85C38] underline cursor-pointer tracking-[0.5px]">
          READ AGENT MANIFEST →
        </span>
      </div>
    </div>

    {/* ── Right column ── */}
    <div className="flex flex-col gap-4">
      <div className="animate-fadeUp" style={{ animationDelay: '80ms' }}>
        <StatsGrid />
      </div>
      <div className="animate-fadeUp" style={{ animationDelay: '160ms' }}>
        <KnowledgeBase />
      </div>
    </div>

    <ChatModal open={modalOpen} onClose={onCloseModal} />
  </div>
)

export default Home
