'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trophy, Sparkles, Users, Gift, Star, CheckCircle2 } from 'lucide-react'
import { initialData } from '@/lib/initialData'

interface Winner {
  name: string
  rank: number
}

export default function LuckyWheel() {
  const [values, setValues] = useState<string>(initialData)
  const [numWinners, setNumWinners] = useState<string>('5')
  const [isSpinning, setIsSpinning] = useState(false)
  const [winners, setWinners] = useState<Winner[]>([])
  const [showAnimation, setShowAnimation] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [visibleWinnerIndex, setVisibleWinnerIndex] = useState<number>(-1)
  const [isMac, setIsMac] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  
  // Audio refs for sound effects
  const winner1AudioRef = useRef<HTMLAudioElement>(null)
  const winner2AudioRef = useRef<HTMLAudioElement>(null)
  const winner3AudioRef = useRef<HTMLAudioElement>(null)
  const winner4AudioRef = useRef<HTMLAudioElement>(null)
  const winner5AudioRef = useRef<HTMLAudioElement>(null)
  const winner6AudioRef = useRef<HTMLAudioElement>(null)

  const valuesList = values.split('\n').filter(v => v.trim() !== '')

  // Function to stop all playing audio
  const stopAllAudio = () => {
    const allAudioRefs = [
      winner1AudioRef,
      winner2AudioRef,
      winner3AudioRef,
      winner4AudioRef,
      winner5AudioRef,
      winner6AudioRef
    ]
    
    allAudioRefs.forEach(audioRef => {
      if (audioRef?.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    })
  }

  // Function to play winner sound based on rank
  const playWinnerSound = (rank: number) => {
    // First, stop all currently playing audio
    stopAllAudio()
    
    let audioRef: React.RefObject<HTMLAudioElement> | null = null
    
    // Map rank to sound file (1-6)
    if (rank === 1) {
      audioRef = winner1AudioRef
    } else if (rank === 2) {
      audioRef = winner2AudioRef
    } else if (rank === 3) {
      audioRef = winner3AudioRef
    } else if (rank === 4) {
      audioRef = winner4AudioRef
    } else if (rank === 5) {
      audioRef = winner5AudioRef
    } else {
      audioRef = winner6AudioRef
    }
    
    // Small delay to ensure previous audio is stopped
    setTimeout(() => {
      if (audioRef?.current) {
        audioRef.current.currentTime = 0 // Reset to beginning
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error)
        })
      }
    }, 50)
  }

  // Detect platform
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
             navigator.userAgent.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  // Keyboard event handler for Shift+N
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Shift+N (works on both Windows/Linux and Mac)
      if (event.shiftKey && event.key.toLowerCase() === 'n') {
        // Only prevent default and handle if dialog is open and showing results
        if (showDialog && winners.length > 0 && visibleWinnerIndex < winners.length - 1) {
          event.preventDefault()
          event.stopPropagation()
          event.stopImmediatePropagation()
          
          const nextIndex = visibleWinnerIndex + 1
          setVisibleWinnerIndex(nextIndex)
          
          // Scroll to the newly visible winner first
          setTimeout(() => {
            const winnerElement = dialogRef.current?.querySelector(`[data-winner-index="${nextIndex}"]`)
            if (winnerElement) {
              winnerElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
              
              // Play sound AFTER the winner element is visible and animation has started
              const nextWinner = winners[nextIndex]
              if (nextWinner && showDialog) {
                // Delay sound to play after winner is visible (600ms matches animation duration)
                setTimeout(() => {
                  playWinnerSound(nextWinner.rank)
                }, 400)
              }
            }
          }, 100)
          
          return false
        }
      }
    }

    // Use capture phase to catch the event early
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    document.addEventListener('keydown', handleKeyDown, { capture: true })
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
    }
  }, [winners.length, visibleWinnerIndex, showDialog])

  // Close dialog handler
  const handleCloseDialog = () => {
    stopAllAudio() // Stop all audio when closing dialog
    setShowDialog(false)
    setVisibleWinnerIndex(-1)
  }

  // Reset visible index when dialog closes
  useEffect(() => {
    if (!showDialog && winners.length > 0) {
      setVisibleWinnerIndex(-1)
    }
  }, [showDialog, winners.length])

  const spinWheel = () => {
    if (valuesList.length === 0) {
      alert('Vui lòng nhập ít nhất một giá trị!')
      return
    }

    const winnerCount = parseInt(numWinners) || 1
    if (winnerCount < 1 || winnerCount > valuesList.length) {
      alert('Số lượng người thắng không hợp lệ!')
      return
    }

    setIsSpinning(true)
    setShowAnimation(false)
    setWinners([])
    
    // Stop all previous audio before starting spin
    stopAllAudio()

    // Play spinning sound (winner1 sound for spinning)
    setTimeout(() => {
      if (winner1AudioRef.current) {
        winner1AudioRef.current.currentTime = 0
        winner1AudioRef.current.play().catch(error => {
          console.log('Audio play failed:', error)
        })
      }
    }, 50)

    // Random selection logic
    const shuffled = [...valuesList].sort(() => Math.random() - 0.5)
    const selectedWinners = shuffled.slice(0, winnerCount).map((name, index) => ({
      name: name.trim(),
      rank: index + 1
    }))

    // Calculate rotation (multiple spins + final position)
    const spins = 5 // Number of full rotations
    const baseRotation = spins * 360
    const finalAngle = Math.random() * 360
    const totalRotation = baseRotation + finalAngle

    if (wheelRef.current) {
      wheelRef.current.style.setProperty('--rotation', `${totalRotation}deg`)
    }

    setCurrentRotation(totalRotation)

    // After spinning animation completes
    setTimeout(() => {
      setIsSpinning(false)
      setWinners(selectedWinners)
      setShowAnimation(true)
      setVisibleWinnerIndex(0) // Show first winner
      setShowDialog(true) // Open dialog
      // Note: First winner sound will play when user presses Shift+N

      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowAnimation(false)
      }, 3000)
    }, 3000)
  }

  // Create wheel SVG slices
  const createWheelSVG = () => {
    if (valuesList.length === 0) return null

    const size = 400
    const center = size / 2
    const radius = center - 20
    const sliceAngle = (2 * Math.PI) / valuesList.length
    const colors = [
      '#0074C8', // Primary Blue
      '#5BB9F0', // Sky Blue
      '#FFD700', // Gold
      '#A5D6A7', // Soft Green
      '#FF6F61', // Coral Red
      '#004B84', // Navy Blue
    ]

    const slices = valuesList.map((value, index) => {
      const startAngle = index * sliceAngle - Math.PI / 2
      const endAngle = (index + 1) * sliceAngle - Math.PI / 2
      
      const x1 = center + radius * Math.cos(startAngle)
      const y1 = center + radius * Math.sin(startAngle)
      const x2 = center + radius * Math.cos(endAngle)
      const y2 = center + radius * Math.sin(endAngle)
      
      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0
      
      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')

      // Text position
      const textAngle = startAngle + sliceAngle / 2
      const textRadius = radius * 0.65
      const textX = center + textRadius * Math.cos(textAngle)
      const textY = center + textRadius * Math.sin(textAngle)

      return { pathData, color: colors[index % colors.length], text: value.trim(), textX, textY, textAngle }
    })

    return (
      <svg 
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.pathData}
                fill={slice.color}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x={slice.textX}
                y={slice.textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#FFFFFF"
                fontSize="14"
                fontWeight="600"
                transform={`rotate(${(slice.textAngle * 180) / Math.PI + 90}, ${slice.textX}, ${slice.textY})`}
                className="pointer-events-none"
              >
                {slice.text.length > 12 ? slice.text.substring(0, 12) + '...' : slice.text}
              </text>
            </g>
          ))}
        </g>
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-white to-cool-gray/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-4">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-blue via-sky-blue to-primary-blue bg-clip-text text-transparent">
              Trò Chơi May Mắn
            </h1>
          </div>
          <p className="text-secondary-text text-lg">Quay vòng quay để tìm ra người chiến thắng!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="values" className="text-main-text font-bold text-lg mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-blue" />
                    Nhập danh sách (mỗi giá trị một dòng)
                  </Label>
                  <Textarea
                    id="values"
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                    placeholder="Nhập các giá trị ở đây...&#10;Ví dụ:&#10;Người 1&#10;Người 2&#10;Người 3"
                    className="mt-2 min-h-[220px] text-base border-2 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all"
                    disabled={isSpinning}
                  />
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <div className={`px-3 py-1 rounded-full font-semibold ${
                      valuesList.length > 0 
                        ? 'bg-soft-green/20 text-soft-green border border-soft-green' 
                        : 'bg-cool-gray/30 text-secondary-text border border-cool-gray'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 inline mr-1" />
                      {valuesList.length} giá trị
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="winners" className="text-main-text font-bold text-lg mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gold" />
                    Số lượng người thắng
                  </Label>
                  <Input
                    id="winners"
                    type="number"
                    min="1"
                    value={numWinners}
                    onChange={(e) => setNumWinners(e.target.value)}
                    className="mt-2 border-2 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all text-lg font-semibold h-12"
                    disabled={isSpinning}
                  />
                </div>

                <Button
                  onClick={spinWheel}
                  disabled={isSpinning || valuesList.length === 0}
                  className="w-full bg-gradient-to-r from-primary-blue to-sky-blue hover:from-primary-blue/90 hover:to-sky-blue/90 text-white py-7 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSpinning ? (
                      <>
                        <Sparkles className="w-6 h-6 animate-spin" />
                        Đang quay...
                      </>
                    ) : (
                      <>
                        <Star className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                        QUAY SỐ MAY MẮN
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Button>
              </div>
            </div>
          </div>

          {/* Wheel Section */}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-full max-w-lg mx-auto aspect-square mb-8">
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-30 transition-opacity duration-500 ${
                isSpinning ? 'bg-gradient-to-br from-primary-blue via-gold to-soft-green animate-pulse' : 'bg-primary-blue'
              }`} />
              
              {valuesList.length > 0 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div
                    ref={wheelRef}
                    className={`relative w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden ${
                      isSpinning ? 'animate-spin-wheel' : ''
                    }`}
                    style={{
                      transform: isSpinning ? undefined : `rotate(${currentRotation}deg)`,
                      transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
                      transformOrigin: 'center center',
                    }}
                  >
                    {createWheelSVG()}
                  </div>
                  {/* Center circle with enhanced design */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-white to-cool-gray rounded-full border-4 border-primary-blue flex items-center justify-center z-10 shadow-2xl pointer-events-none">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-soft-green rounded-full flex items-center justify-center shadow-inner">
                      <Trophy className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full rounded-full border-8 border-white shadow-2xl bg-gradient-to-br from-cool-gray to-white/50 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center px-6">
                    <Users className="w-16 h-16 text-secondary-text/50 mx-auto mb-4" />
                    <p className="text-secondary-text text-lg font-medium">
                      Nhập danh sách để bắt đầu
                    </p>
                  </div>
                </div>
              )}

              {/* Enhanced Pointer */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                <div className="relative">
                  <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[40px] border-t-primary-blue drop-shadow-2xl" />
                  <div className="absolute top-[-38px] left-1/2 -translate-x-1/2 w-8 h-8 bg-primary-blue rounded-full border-4 border-white shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Animation */}
        {showAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {/* Confetti effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#FFD700', '#FF6F61', '#A5D6A7', '#0074C8', '#5BB9F0'][i % 5],
                      transform: `rotate(${i * 30}deg) translateY(-120px)`,
                      animation: `confetti 2s ease-out ${i * 0.1}s forwards`,
                    }}
                  />
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-white to-cool-gray/50 backdrop-blur-xl rounded-3xl p-12 shadow-2xl animate-win-pulse border-2 border-gold/50">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl animate-ping" />
                    <Sparkles className="w-20 h-20 text-gold animate-spin relative z-10" />
                    <Trophy className="w-14 h-14 text-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 drop-shadow-lg" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gold via-soft-green to-primary-blue bg-clip-text text-transparent mb-2">
                      Chúc Mừng!
                    </h2>
                    <p className="text-xl text-main-text font-medium">
                      Đã chọn được người thắng cuộc!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Winner Dialog Modal */}
        {showDialog && winners.length > 0 && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div 
              ref={dialogRef}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300"
            >
              {/* Dialog Header */}
              <div className="bg-gradient-to-r from-primary-blue to-sky-blue p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold">Bảng Xếp Hạng Người Thắng</h2>
                    <p className="text-white/80 text-sm mt-1">
                      {winners.length} người thắng cuộc
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseDialog}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Đóng"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-app-bg to-white">
                {winners.length > 0 ? (
                  <div className="space-y-4">
                    {winners.slice(0, visibleWinnerIndex + 1).map((winner, index) => (
                      <div
                        key={index}
                        data-winner-index={index}
                        className={`group flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg ${
                          winner.rank === 1
                            ? 'bg-gradient-to-r from-gold/30 via-soft-green/20 to-gold/30 border-gold shadow-lg'
                            : winner.rank === 2
                            ? 'bg-gradient-to-r from-sky-blue/20 via-primary-blue/10 to-sky-blue/20 border-sky-blue shadow-md'
                            : winner.rank === 3
                            ? 'bg-gradient-to-r from-soft-green/20 via-primary-blue/10 to-soft-green/20 border-soft-green shadow-md'
                            : 'bg-white/50 border-cool-gray/50 hover:border-primary-blue/50'
                        }`}
                        style={{
                          animation: index <= visibleWinnerIndex ? `winnerSlideIn 0.6s ease-out forwards` : 'none',
                          opacity: index <= visibleWinnerIndex ? 1 : 0,
                        }}
                      >
                        {/* Rank Badge */}
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl shadow-lg ${
                              winner.rank === 1
                                ? 'bg-gradient-to-br from-gold to-soft-green'
                                : winner.rank === 2
                                ? 'bg-gradient-to-br from-sky-blue to-primary-blue'
                                : winner.rank === 3
                                ? 'bg-gradient-to-br from-soft-green to-primary-blue'
                                : 'bg-gradient-to-br from-primary-blue to-navy-blue'
                            }`}
                          >
                            {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : winner.rank === 3 ? '🥉' : winner.rank}
                          </div>
                          {winner.rank === 1 && (
                            <div className="absolute -top-1 -right-1">
                              <Star className="w-6 h-6 text-gold fill-gold animate-pulse" />
                            </div>
                          )}
                        </div>
                        
                        {/* Winner Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xl text-main-text mb-1 truncate">
                            {winner.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                              winner.rank === 1
                                ? 'bg-gold/20 text-gold'
                                : winner.rank === 2
                                ? 'bg-sky-blue/20 text-sky-blue'
                                : winner.rank === 3
                                ? 'bg-soft-green/20 text-soft-green'
                                : 'bg-primary-blue/20 text-primary-blue'
                            }`}>
                              Vị trí #{winner.rank}
                            </span>
                            {winner.rank === 1 && (
                              <span className="text-xs font-bold text-gold bg-gold/10 px-2 py-1 rounded-full">
                                CHAMPION
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Trophy Icon for Winner */}
                        {winner.rank === 1 && (
                          <div className="flex-shrink-0">
                            <Trophy className="w-10 h-10 text-gold drop-shadow-lg animate-bounce" />
                          </div>
                        )}
                        {winner.rank <= 3 && winner.rank !== 1 && (
                          <div className="flex-shrink-0">
                            <Star className={`w-8 h-8 ${
                              winner.rank === 2 ? 'text-sky-blue' : 'text-soft-green'
                            }`} />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Keyboard hint */}
                    {visibleWinnerIndex < winners.length - 1 && (
                      <div className="mt-6 p-5 bg-primary-blue/10 border-2 border-dashed border-primary-blue rounded-2xl text-center animate-pulse">
                        <p className="text-base text-primary-blue font-bold flex items-center justify-center gap-2">
                          <span>Nhấn</span>
                          <kbd className="px-3 py-1.5 bg-white rounded-lg border-2 border-primary-blue font-mono text-sm font-bold shadow-md">
                            Shift
                          </kbd>
                          <span>+</span>
                          <kbd className="px-3 py-1.5 bg-white rounded-lg border-2 border-primary-blue font-mono text-sm font-bold shadow-md">
                            N
                          </kbd>
                          <span>để hiển thị người thắng tiếp theo</span>
                        </p>
                        <p className="text-sm text-primary-blue/70 mt-2">
                          ({visibleWinnerIndex + 1} / {winners.length})
                        </p>
                      </div>
                    )}
                    
                    {/* All winners shown message */}
                    {visibleWinnerIndex >= winners.length - 1 && (
                      <div className="mt-6 p-5 bg-soft-green/20 border-2 border-soft-green rounded-2xl text-center">
                        <p className="text-base text-soft-green font-bold flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Đã hiển thị tất cả người thắng cuộc!
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Gift className="w-20 h-20 text-cool-gray mx-auto mb-4 opacity-50" />
                    <p className="text-secondary-text text-lg">
                      Chưa có người thắng cuộc
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden audio elements for sound effects */}
      <audio ref={winner1AudioRef} preload="auto">
        <source src="/winner1.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={winner2AudioRef} preload="auto">
        <source src="/winner2.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={winner3AudioRef} preload="auto">
        <source src="/winner3.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={winner4AudioRef} preload="auto">
        <source src="/winner4.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={winner5AudioRef} preload="auto">
        <source src="/winner5.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={winner6AudioRef} preload="auto">
        <source src="/winner6.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}
