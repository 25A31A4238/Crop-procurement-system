# Simulation of the renderFarmerMspTicker speed logic in Python

def calc_ticker_speed(total_items_in_season):
    # Same logic as app.js
    loop_items = list(range(total_items_in_season))
    if len(loop_items) > 0 and len(loop_items) < 18:
        import math
        repeat_count = math.ceil(18 / len(loop_items))
        base_items = list(loop_items)
        for r in range(1, repeat_count):
            loop_items.extend(base_items)
            
    SECONDS_PER_CROP = 95 / 28 # ~3.392857 s
    computed_duration = max(12, len(loop_items) * SECONDS_PER_CROP)
    
    # Speed in cards per second
    speed_cards_per_sec = len(loop_items) / computed_duration
    # Seconds each crop takes to cross
    sec_per_crop = computed_duration / len(loop_items)
    return len(loop_items), computed_duration, speed_cards_per_sec, sec_per_crop

all_crops = 28
kharif_crops = 18
rabi_crops = 6

print("SEASON SPEED COMPARISON:")
for name, count in [("ALL CROPS", all_crops), ("KHARIF CROPS", kharif_crops), ("RABI CROPS", rabi_crops)]:
    rendered_cnt, duration, speed, sec_crop = calc_ticker_speed(count)
    print(f"[{name}] {count} raw crops -> {rendered_cnt} rendered cards | Duration: {duration:.2f}s | Speed: {speed:.4f} cards/sec | Pace: {sec_crop:.3f}s per card")

# Check that speeds are identical
s_all = calc_ticker_speed(28)[2]
s_kharif = calc_ticker_speed(18)[2]
s_rabi = calc_ticker_speed(6)[2]

assert abs(s_all - s_kharif) < 1e-6, "Kharif speed mismatch!"
assert abs(s_all - s_rabi) < 1e-6, "Rabi speed mismatch!"
print("\n[SUCCESS] Speed across ALL, KHARIF, and RABI is 100% IDENTICAL!")
