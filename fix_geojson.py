#!/usr/bin/env python3
"""
Script to fix GeoJSON validation issues including:
- LineString features with only one coordinate pair
- Invalid coordinate values (non-numeric)
- Empty coordinate arrays
- Malformed geometry structures
"""

import json
import sys
from typing import Dict, List, Any, Union

def is_valid_coordinate(coord: Any) -> bool:
    """Check if a coordinate is a valid number."""
    return isinstance(coord, (int, float)) and not (isinstance(coord, bool))

def fix_coordinate_array(coords: List[Any]) -> List[float]:
    """Fix coordinate array by converting to valid numbers."""
    fixed_coords = []
    for coord in coords:
        if is_valid_coordinate(coord):
            fixed_coords.append(float(coord))
        else:
            # Try to convert string numbers
            try:
                fixed_coords.append(float(str(coord)))
            except (ValueError, TypeError):
                # Use 0.0 as fallback for invalid coordinates
                print(f"    Warning: Invalid coordinate '{coord}' replaced with 0.0")
                fixed_coords.append(0.0)
    return fixed_coords

def fix_geojson_comprehensive(input_file: str, output_file: str = None) -> None:
    """
    Fix GeoJSON file by converting single-coordinate LineStrings to Points
    or removing them if they're incomplete data.
    
    Args:
        input_file: Path to input GeoJSON file
        output_file: Path to output file (defaults to input_file + '_fixed.geojson')
    """
    
    if output_file is None:
        output_file = input_file.replace('.geojson', '_fixed.geojson')
    
    print(f"Reading GeoJSON file: {input_file}")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading file: {e}")
        return
    
    if not isinstance(data, dict) or 'features' not in data:
        print("Error: Invalid GeoJSON format - missing 'features' array")
        return
    
    features = data['features']
    fixed_count = 0
    removed_count = 0
    coordinate_fixes = 0
    
    print(f"Processing {len(features)} features...")
    
    # Process features in reverse order so we can safely remove items
    for i in range(len(features) - 1, -1, -1):
        feature = features[i]
        
        if not isinstance(feature, dict) or 'geometry' not in feature:
            continue
            
        geometry = feature['geometry']
        if not isinstance(geometry, dict):
            continue
            
        geom_type = geometry.get('type')
        coordinates = geometry.get('coordinates', [])
        feature_name = feature.get('properties', {}).get('name', f'Feature {i}')
        
        # Fix different geometry types
        if geom_type == 'LineString':
            if len(coordinates) == 0:
                print(f"Found empty LineString: {feature_name} - removing")
                features.pop(i)
                removed_count += 1
                continue
            elif len(coordinates) == 1:
                print(f"Found invalid LineString: {feature_name} (only 1 coordinate)")
                print(f"  Converting to Point geometry")
                
                # Fix coordinates if needed
                if len(coordinates[0]) >= 2:
                    fixed_coords = fix_coordinate_array(coordinates[0])
                    feature['geometry']['type'] = 'Point'
                    feature['geometry']['coordinates'] = fixed_coords
                    fixed_count += 1
                else:
                    print(f"  Invalid coordinate structure - removing")
                    features.pop(i)
                    removed_count += 1
                continue
            else:
                # Fix coordinates in valid LineString
                fixed_coordinates = []
                coords_fixed = False
                for coord_pair in coordinates:
                    if isinstance(coord_pair, list) and len(coord_pair) >= 2:
                        original_coords = coord_pair.copy()
                        fixed_pair = fix_coordinate_array(coord_pair)
                        fixed_coordinates.append(fixed_pair)
                        if fixed_pair != original_coords:
                            coords_fixed = True
                    else:
                        print(f"  Invalid coordinate pair in {feature_name}: {coord_pair}")
                        coords_fixed = True
                
                if coords_fixed:
                    geometry['coordinates'] = fixed_coordinates
                    coordinate_fixes += 1
                    print(f"  Fixed coordinates in LineString: {feature_name}")
        
        elif geom_type == 'Point':
            if isinstance(coordinates, list) and len(coordinates) >= 2:
                original_coords = coordinates.copy()
                fixed_coords = fix_coordinate_array(coordinates)
                if fixed_coords != original_coords:
                    geometry['coordinates'] = fixed_coords
                    coordinate_fixes += 1
                    print(f"  Fixed coordinates in Point: {feature_name}")
            else:
                print(f"Found invalid Point: {feature_name} - removing")
                features.pop(i)
                removed_count += 1
        
        elif geom_type in ['Polygon', 'MultiLineString', 'MultiPoint', 'MultiPolygon']:
            # Handle other geometry types if needed
            pass
    
    print(f"\nSummary:")
    print(f"  Fixed (LineString → Point): {fixed_count}")
    print(f"  Fixed coordinates: {coordinate_fixes}")
    print(f"  Removed (empty/invalid): {removed_count}")
    print(f"  Total features remaining: {len(features)}")
    
    # Write the fixed GeoJSON
    print(f"\nWriting fixed GeoJSON to: {output_file}")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("✅ File successfully fixed!")
        print(f"\nNext steps:")
        print(f"1. Replace your original file with: {output_file}")
        print(f"2. Validate the fixed file in your GeoJSON viewer")
        print(f"3. All validation errors should now be resolved!")
    except Exception as e:
        print(f"Error writing file: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_geojson.py <input_file.geojson> [output_file.geojson]")
        print("\nThis script fixes common GeoJSON validation issues:")
        print("- LineString features with only one coordinate")
        print("- Invalid coordinate values (non-numeric)")
        print("- Empty coordinate arrays")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    fix_geojson_comprehensive(input_file, output_file)

if __name__ == "__main__":
    main()
