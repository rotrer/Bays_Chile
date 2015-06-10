package com.mareaschile.app;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Created by cristian on 26-03-15.
 */
public class JSONAdapter extends BaseAdapter {

    //private static final String IMAGE_URL_BASE = "http://covers.openlibrary.org/b/id/";

    public Context mContext;
    public LayoutInflater mInflater;
    public JSONArray mJsonArray;

    public JSONAdapter(Context context, LayoutInflater inflater) {
        mContext = context;
        mInflater = inflater;
        mJsonArray = new JSONArray();
    }

    @Override
    public int getCount() {
        return mJsonArray.length();
    }

    @Override
    public Object getItem(int position) {
        return mJsonArray.optJSONObject(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;

        // check if the view already exists
        // if so, no need to inflate and findViewById again!
        if (convertView == null) {

            // Inflate the custom row layout from your XML.
            convertView = mInflater.inflate(R.layout.location, null);

            // create a new "Holder" with subviews
            holder = new ViewHolder();
            holder.nomlocalidadTextView = (TextView) convertView.findViewById(R.id.location_name);

            // hang onto this holder for future recyclage
            convertView.setTag(holder);
        } else {

            // skip all the expensive inflation/findViewById
            // and just get the holder you already made
            holder = (ViewHolder) convertView.getTag();
        }
        // More code after this

        // Get the current book's data in JSON form
        JSONObject jsonObject = (JSONObject) getItem(position);

        // See if there is a cover ID in the Object
        /*if (jsonObject.has("cover_i")) {

            // If so, grab the Cover ID out from the object
            String imageID = jsonObject.optString("cover_i");

            // Construct the image URL (specific to API)
            String imageURL = IMAGE_URL_BASE + imageID + "-S.jpg";

            // Use Picasso to load the image
            // Temporarily have a placeholder in case it's slow to load
            Picasso.with(mContext).load(imageURL).placeholder(R.mipmap.ic_books).into(holder.thumbnailImageView);
        } else {

            // If there is no cover ID in the object, use a placeholder
            holder.thumbnailImageView.setImageResource(R.mipmap.ic_books);
        }*/

        // Grab the title and author from the JSON
        String nombreLocalidad = "";
        //String authorName = "";

        if (jsonObject.has("name")) {
            nombreLocalidad = jsonObject.optString("name");
        }

        // Send these Strings to the TextViews for display
        holder.nomlocalidadTextView.setText(nombreLocalidad);

        return convertView;
    }

    private static class ViewHolder {
        //public ImageView thumbnailImageView;
        //public TextView titleTextView;
        public TextView nomlocalidadTextView;
    }

    public void updateData(JSONArray jsonArray) {
        // update the adapter's dataset
        mJsonArray = jsonArray;
        //Log.d("omg", mJsonArray.toString());
        notifyDataSetChanged();
    }
}
