with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('Total {:', text.count('{'))
print('Total }:', text.count('}'))

# Look for ${ inside template literals vs actual code blocks
# Let's inspect where the discrepancy is
diff = text.count('}') - text.count('{')
print('Difference:', diff)

# Search for double closing braces around the schedule renderer
with open('scratch/build_schedule_renderer.py', 'r', encoding='utf-8') as f:
    orig = f.read()

print('build_schedule_renderer {:', orig.count('{'), '}:', orig.count('}'))
